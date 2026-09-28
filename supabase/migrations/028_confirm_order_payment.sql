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

  update public.orders
  set payment_status = 'paid'
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

revoke all on function public.mark_order_paid(text, text)
from public;

grant execute on function public.mark_order_paid(text, text)
to authenticated;