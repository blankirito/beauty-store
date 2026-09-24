-- Link a checkout order to the signed-in shopper when one exists.
-- Guest checkouts remain guest orders and retain token-based tracking.

create or replace function public.attach_authenticated_customer_to_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.customer_id is null and auth.uid() is not null then
    new.customer_id := auth.uid();
  end if;

  return new;
end;
$$;

drop trigger if exists attach_authenticated_customer_to_order
on public.orders;

create trigger attach_authenticated_customer_to_order
before insert on public.orders
for each row
execute procedure public.attach_authenticated_customer_to_order();