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

grant execute on function public.advance_order_fulfillment(
  text,
  text,
  text
) to authenticated;