-- Public product-image bucket and owner/admin Storage rules.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.product_image_store_id(object_name text)
returns uuid
language plpgsql
immutable
set search_path = public, storage
as $$
declare
  path_parts text[];
begin
  path_parts := storage.foldername(object_name);
  if array_length(path_parts, 1) < 4 or path_parts[1] <> 'stores' or path_parts[3] <> 'products' then
    return null;
  end if;
  return path_parts[2]::uuid;
exception
  when invalid_text_representation then return null;
end;
$$;

drop policy if exists "Store owners and admins can upload product images" on storage.objects;
create policy "Store owners and admins can upload product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (public.is_platform_admin() or public.has_store_role(public.product_image_store_id(name), array['owner', 'admin']::public.store_member_role[])));

drop policy if exists "Store owners and admins can update product images" on storage.objects;
create policy "Store owners and admins can update product images" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and (public.is_platform_admin() or public.has_store_role(public.product_image_store_id(name), array['owner', 'admin']::public.store_member_role[])))
  with check (bucket_id = 'product-images' and (public.is_platform_admin() or public.has_store_role(public.product_image_store_id(name), array['owner', 'admin']::public.store_member_role[])));

drop policy if exists "Store owners and admins can delete product images" on storage.objects;
create policy "Store owners and admins can delete product images" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (public.is_platform_admin() or public.has_store_role(public.product_image_store_id(name), array['owner', 'admin']::public.store_member_role[])));
