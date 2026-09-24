create table public.customer_wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),

  unique (user_id, product_id)
);

alter table public.customer_wishlist_items enable row level security;

create policy "Customers can view their wishlist items"
on public.customer_wishlist_items
for select
to authenticated
using (auth.uid() = user_id);

create policy "Customers can add their wishlist items"
on public.customer_wishlist_items
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Customers can remove their wishlist items"
on public.customer_wishlist_items
for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, delete
on table public.customer_wishlist_items
to authenticated;