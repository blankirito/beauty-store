-- Pending orders reserve inventory for 24 hours.
-- Inventory is released exactly once when an order is cancelled or expires.

alter table public.orders
  add column if not exists inventory_reservation_expires_at timestamptz,
  add column if not exists inventory_released_at timestamptz;

create index if not exists orders_inventory_reservation_expiry_idx
  on public.orders (
    inventory_reservation_expires_at
  )
  where inventory_released_at is null;

create or replace function public.set_order_inventory_reservation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.payment_status = 'pending'
     and new.fulfillment_status = 'new'
     and new.inventory_reservation_expires_at is null then
    new.inventory_reservation_expires_at := now() + interval '24 hours';
  end if;

  return new;
end;
$$;

drop trigger if exists set_order_inventory_reservation
on public.orders;

create trigger set_order_inventory_reservation
before insert on public.orders
for each row
execute function public.set_order_inventory_reservation();

create or replace function public.release_order_inventory(
  p_order_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_item record;
begin
  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found or v_order.inventory_released_at is not null then
    return false;
  end if;

  for v_item in
    select product_id, quantity
    from public.order_items
    where order_id = v_order.id
      and product_id is not null
  loop
    update public.products
    set stock = stock + v_item.quantity
    where id = v_item.product_id;
  end loop;

  update public.orders
  set
    inventory_released_at = now(),
    inventory_reservation_expires_at = null
  where id = v_order.id;

  return true;
end;
$$;

revoke all on function public.release_order_inventory(uuid)
from public, anon, authenticated;

grant execute on function public.release_order_inventory(uuid)
to service_role;

create or replace function public.mark_order_paid(
  p_order_number text,
  p_note text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_note text := nullif(btrim(coalesce(p_note, '')), '');
begin
  select *
  into v_order
  from public.orders
  where order_number = p_order_number
  for update;

  if not found then
    raise exception 'Order not found.';
  end if;

  if not (
    public.is_platform_admin()
    or public.has_store_role(
      v_order.store_id,
      array['owner', 'admin']::public.store_member_role[]
    )
  ) then
    raise exception 'You do not have permission to confirm payment for this order.';
  end if;

  if v_order.fulfillment_status = 'cancelled' then
    raise exception 'Cancelled orders cannot be marked as paid.';
  end if;

  if v_order.payment_status <> 'pending' then
    raise exception 'This order has already been paid or cannot be confirmed.';
  end if;

  if v_order.inventory_reservation_expires_at is not null
     and v_order.inventory_reservation_expires_at <= now() then
    raise exception 'This order reservation has expired and can no longer be paid.';
  end if;

  update public.orders
  set
    payment_status = 'paid',
    inventory_reservation_expires_at = null
  where id = v_order.id
  returning * into v_order;

  insert into public.order_events (
    order_id,
    fulfillment_status,
    title,
    note
  )
  values (
    v_order.id,
    null,
    'Payment confirmed',
    coalesce(v_note, 'Payment was confirmed by store staff.')
  );

  return v_order;
end;
$$;

create or replace function public.advance_order_fulfillment(
  p_order_number text,
  p_next_status text,
  p_note text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_event_title text;
begin
  select *
  into v_order
  from public.orders
  where order_number = p_order_number
  for update;

  if not found then
    raise exception 'Order not found.';
  end if;

  if not (
    public.is_platform_admin()
    or public.has_store_role(
      v_order.store_id,
      array['owner', 'admin']::public.store_member_role[]
    )
  ) then
    raise exception 'You do not have permission to update this order.';
  end if;

  if not (
    (v_order.fulfillment_status = 'new'
      and p_next_status in ('processing', 'cancelled'))
    or
    (v_order.fulfillment_status = 'processing'
      and p_next_status in ('shipped', 'cancelled'))
    or
    (v_order.fulfillment_status = 'shipped'
      and p_next_status = 'delivered')
  ) then
    raise exception 'This order can no longer be moved to that status.';
  end if;

  if p_next_status <> 'cancelled'
     and v_order.payment_status <> 'paid' then
    raise exception 'Confirm payment before processing this order.';
  end if;

  v_event_title := case p_next_status
    when 'processing' then 'Order is being processed'
    when 'shipped' then 'Order has been shipped'
    when 'delivered' then 'Order has been delivered'
    when 'cancelled' then 'Order has been cancelled'
  end;

  update public.orders
  set fulfillment_status = p_next_status
  where id = v_order.id
  returning * into v_order;

  if p_next_status = 'cancelled' then
    perform public.release_order_inventory(v_order.id);
  end if;

  insert into public.order_events (
    order_id,
    fulfillment_status,
    title,
    note
  )
  values (
    v_order.id,
    p_next_status,
    v_event_title,
    p_note
  );

  select *
  into v_order
  from public.orders
  where id = v_order.id;

  return v_order;
end;
$$;

create or replace function public.release_expired_inventory_reservations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_released_count integer := 0;
begin
  for v_order in
    select id
    from public.orders
    where payment_status = 'pending'
      and fulfillment_status = 'new'
      and inventory_released_at is null
      and inventory_reservation_expires_at <= now()
    for update skip locked
  loop
    update public.orders
    set fulfillment_status = 'cancelled'
    where id = v_order.id;

    if public.release_order_inventory(v_order.id) then
      v_released_count := v_released_count + 1;
    end if;

    insert into public.order_events (
      order_id,
      fulfillment_status,
      title,
      note
    )
    values (
      v_order.id,
      'cancelled',
      'Order cancelled',
      'Payment was not confirmed within 24 hours. Inventory was released.'
    );
  end loop;

  return v_released_count;
end;
$$;

revoke all on function public.release_expired_inventory_reservations()
from public, anon, authenticated;

grant execute on function public.release_expired_inventory_reservations()
to service_role;