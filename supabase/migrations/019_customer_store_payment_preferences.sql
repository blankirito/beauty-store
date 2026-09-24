create table public.customer_store_payment_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  payment_method_id uuid not null references public.store_payment_methods(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, store_id)
);

create trigger set_customer_store_payment_preferences_updated_at
before update on public.customer_store_payment_preferences
for each row
execute function public.set_updated_at();

alter table public.customer_store_payment_preferences enable row level security;

create policy "Customers can view their payment preferences"
on public.customer_store_payment_preferences
for select
to authenticated
using (auth.uid() = user_id);

create policy "Customers can create their payment preferences"
on public.customer_store_payment_preferences
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Customers can update their payment preferences"
on public.customer_store_payment_preferences
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Customers can delete their payment preferences"
on public.customer_store_payment_preferences
for delete
to authenticated
using (auth.uid() = user_id);

create or replace function public.validate_customer_store_payment_preference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.store_payment_methods
    where id = new.payment_method_id
      and store_id = new.store_id
      and is_enabled = true
  ) then
    raise exception 'Choose an enabled payment method from this store.';
  end if;

  return new;
end;
$$;

create trigger validate_customer_store_payment_preference
before insert or update
on public.customer_store_payment_preferences
for each row
execute function public.validate_customer_store_payment_preference();