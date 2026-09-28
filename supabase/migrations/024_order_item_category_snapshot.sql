alter table public.order_items
add column if not exists product_category text;

create or replace function public.assign_order_item_category()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.product_category is null then
    select category
    into new.product_category
    from public.products
    where id = new.product_id;
  end if;

  return new;
end;
$$;

drop trigger if exists assign_order_item_category
on public.order_items;

create trigger assign_order_item_category
before insert on public.order_items
for each row
execute function public.assign_order_item_category();