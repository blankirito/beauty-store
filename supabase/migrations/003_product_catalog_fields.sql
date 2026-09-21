-- Fields and rules used by the admin ProductForm.

alter table public.products
  add column if not exists status text,
  add column if not exists low_stock_threshold integer not null default 5,
  add column if not exists collection text,
  add column if not exists dimensions text,
  add column if not exists weight text;

update public.products
set status = case when is_active then 'active' else 'draft' end
where status is null;

alter table public.products
  alter column is_active set default false,
  alter column status set default 'draft',
  alter column status set not null;

alter table public.products
  drop constraint if exists products_status_check,
  drop constraint if exists products_status_matches_visibility,
  drop constraint if exists products_low_stock_threshold_check;

alter table public.products
  add constraint products_status_check check (status in ('active', 'draft', 'archived')),
  add constraint products_status_matches_visibility check (
    (status = 'active' and is_active = true)
    or (status in ('draft', 'archived') and is_active = false)
  ),
  add constraint products_low_stock_threshold_check check (low_stock_threshold >= 0);

create index if not exists products_store_status_idx on public.products (store_id, status);
