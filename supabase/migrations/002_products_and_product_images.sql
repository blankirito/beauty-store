-- Products, product images, updated-at triggers, and their RLS policies.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
drop trigger if exists set_stores_updated_at on public.stores;
create trigger set_stores_updated_at before update on public.stores
  for each row execute procedure public.set_updated_at();

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  sku text not null,
  name text not null,
  slug text not null,
  description text not null default '',
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  features text[] not null default '{}',
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  is_active boolean not null default true,
  is_new boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, sku),
  unique (store_id, slug)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, sort_order)
);

create unique index if not exists one_primary_image_per_product on public.product_images (product_id) where is_primary = true;
create index if not exists products_store_id_index on public.products (store_id);
create index if not exists product_images_product_id_index on public.product_images (product_id);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products
  for each row execute procedure public.set_updated_at();

alter table public.products enable row level security;
alter table public.product_images enable row level security;
grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.product_images to authenticated;

create policy "Public can view active products" on public.products for select to anon, authenticated
  using (is_active = true or public.is_platform_admin() or public.has_store_role(store_id, array['owner', 'admin', 'staff']::public.store_member_role[]));
create policy "Store owners and admins can create products" on public.products for insert to authenticated
  with check (public.is_platform_admin() or public.has_store_role(store_id, array['owner', 'admin']::public.store_member_role[]));
create policy "Store owners and admins can update products" on public.products for update to authenticated
  using (public.is_platform_admin() or public.has_store_role(store_id, array['owner', 'admin']::public.store_member_role[]))
  with check (public.is_platform_admin() or public.has_store_role(store_id, array['owner', 'admin']::public.store_member_role[]));
create policy "Store owners and admins can delete products" on public.products for delete to authenticated
  using (public.is_platform_admin() or public.has_store_role(store_id, array['owner', 'admin']::public.store_member_role[]));
create policy "Public can view images of active products" on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products where products.id = product_images.product_id and (products.is_active = true or public.is_platform_admin() or public.has_store_role(products.store_id, array['owner', 'admin', 'staff']::public.store_member_role[]))));
create policy "Store owners and admins can add product images" on public.product_images for insert to authenticated
  with check (exists (select 1 from public.products where products.id = product_images.product_id and (public.is_platform_admin() or public.has_store_role(products.store_id, array['owner', 'admin']::public.store_member_role[]))));
create policy "Store owners and admins can update product images" on public.product_images for update to authenticated
  using (exists (select 1 from public.products where products.id = product_images.product_id and (public.is_platform_admin() or public.has_store_role(products.store_id, array['owner', 'admin']::public.store_member_role[]))))
  with check (exists (select 1 from public.products where products.id = product_images.product_id and (public.is_platform_admin() or public.has_store_role(products.store_id, array['owner', 'admin']::public.store_member_role[]))));
create policy "Store owners and admins can delete product images" on public.product_images for delete to authenticated
  using (exists (select 1 from public.products where products.id = product_images.product_id and (public.is_platform_admin() or public.has_store_role(products.store_id, array['owner', 'admin']::public.store_member_role[]))));
