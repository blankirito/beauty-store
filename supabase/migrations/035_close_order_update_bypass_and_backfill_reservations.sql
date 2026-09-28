-- Orders must only change through protected RPC functions.
-- This prevents browser clients from directly setting orders as paid,
-- processing, shipped, delivered, or cancelled.

revoke update on table public.orders from public, anon, authenticated;

drop policy if exists "Store owners and admins can update orders"
on public.orders;

-- Orders created before inventory reservations were introduced did not
-- receive an expiry time. Give every still-pending new order the same
-- 24-hour reservation rule as newly created orders.
update public.orders
set inventory_reservation_expires_at = created_at + interval '24 hours'
where payment_status = 'pending'
  and fulfillment_status = 'new'
  and inventory_released_at is null
  and inventory_reservation_expires_at is null;