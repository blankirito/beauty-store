create table if not exists public.store_product_sku_counters (
  store_id uuid primary key references public.stores(id) on delete cascade,
  last_value integer not null default 0 check (last_value >= 0)
);

alter table public.store_product_sku_counters enable row level security;

insert into public.store_product_sku_counters (
  store_id,
  last_value
)
select
  store_id,
  coalesce(
    max((substring(sku from '^SKU-([0-9]+)$'))::integer),
    0
  )
from public.products
group by store_id
on conflict (store_id) do update
set last_value = greatest(
  public.store_product_sku_counters.last_value,
  excluded.last_value
);

create or replace function public.assign_product_sku()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_sku_number integer;
begin
  insert into public.store_product_sku_counters (
    store_id,
    last_value
  )
  values (
    new.store_id,
    1
  )
  on conflict (store_id) do update
  set last_value = public.store_product_sku_counters.last_value + 1
  returning last_value into next_sku_number;

  new.sku := 'SKU-' || lpad(next_sku_number::text, 4, '0');

  return new;
end;
$$;

drop trigger if exists assign_product_sku on public.products;

create trigger assign_product_sku
before insert on public.products
for each row
execute function public.assign_product_sku();