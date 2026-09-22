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
  where order_number = p_order_number;

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

grant execute on function public.ship_order(
  text,
  text,
  text,
  text
) to authenticated;