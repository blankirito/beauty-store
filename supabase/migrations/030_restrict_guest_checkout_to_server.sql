-- Guest checkout orders may only be created by the application server.
-- Browser clients no longer have direct permission to reserve stock.

revoke all on function public.create_guest_checkout_order(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  uuid,
  jsonb
) from public, anon, authenticated;

grant execute on function public.create_guest_checkout_order(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  uuid,
  jsonb
) to service_role;