create or replace function public.create_new_order_notifications(
  p_order_id uuid,
  p_customer_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_store_id uuid;
  v_order_number text;
  v_customer_name text;
begin
  select
    store_id,
    order_number
  into
    v_store_id,
    v_order_number
  from public.orders
  where id = p_order_id;

  if not found then
    raise exception 'Order not found for notification.';
  end if;

  v_customer_name := coalesce(
    nullif(btrim(p_customer_name), ''),
    'A customer'
  );

  insert into public.store_notifications (
    store_id,
    recipient_user_id,
    order_id,
    title,
    body
  )
  select
    v_store_id,
    members.user_id,
    p_order_id,
    'New order ' || v_order_number,
    v_customer_name || ' placed a new order.'
  from public.store_members as members
  where members.store_id = v_store_id
    and members.role in ('owner', 'admin')
    and not exists (
      select 1
      from public.store_notifications as existing
      where existing.order_id = p_order_id
        and existing.recipient_user_id = members.user_id
    );
end;
$$;

revoke all on function public.create_new_order_notifications(uuid, text)
from public, anon, authenticated;

grant execute on function public.create_new_order_notifications(uuid, text)
to service_role;

create or replace function public.mark_store_notification_read(
  p_notification_id uuid,
  p_recipient_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.store_notifications
  set read_at = coalesce(read_at, now())
  where id = p_notification_id
    and recipient_user_id = p_recipient_user_id;

  if not found then
    raise exception 'Notification not found for this recipient.';
  end if;
end;
$$;

revoke all on function public.mark_store_notification_read(uuid, uuid)
from public, anon, authenticated;

grant execute on function public.mark_store_notification_read(uuid, uuid)
to service_role;