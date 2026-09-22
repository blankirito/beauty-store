create or replace function public.get_public_storefront(
  p_store_slug text
)
returns table (
  id uuid,
  name text,
  slug text,
  description text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    stores.id,
    stores.name,
    stores.slug,
    coalesce(stores.description, '')
  from public.stores
  where stores.slug = lower(btrim(p_store_slug));
$$;

grant execute on function public.get_public_storefront(text)
to anon, authenticated;