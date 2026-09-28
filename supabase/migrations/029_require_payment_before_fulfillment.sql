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

  return v_order;
end;
$$;

create or replace function public.ship_order(
  p_order_number text,
  p_tracking_carrier text,
  p_tracking_number text,
  p_note text default null
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
  v_carrier text := btrim(p_tracking_carrier);
  v_tracking_number text := btrim(p_tracking_number);
begin
  if v_carrier = '' or v_tracking_number = '' then
    raise exception 'Enter both a shipping carrier and tracking number.';
  end if;

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

  if v_order.fulfillment_status <> 'processing' then
    raise exception 'Only processing orders can be marked as shipped.';
  end if;

  if v_order.payment_status <> 'paid' then
    raise exception 'Confirm payment before shipping this order.';
  end if;

  update public.orders
  set
    fulfillment_status = 'shipped',
    tracking_carrier = v_carrier,
    tracking_number = v_tracking_number
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
    'shipped',
    'Order has been shipped',
    coalesce(
      p_note,
      v_carrier || ' tracking: ' || v_tracking_number
    )
  );

  return v_order;
end;
$$;