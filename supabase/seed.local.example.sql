-- Copy this file to seed.local.sql, replace the placeholders, then run it locally.
-- Do not commit seed.local.sql.

update public.profiles
set is_platform_admin = true
where id = (select id from auth.users where email = '<platform-admin-email>');

insert into public.stores (owner_id, name, slug, description)
select id, 'Boutique Demo Store', 'boutique-demo-store', 'Development store for testing'
from auth.users
where email = '<first-store-owner-email>'
on conflict (slug) do nothing;

insert into public.stores (owner_id, name, slug, description)
select id, 'Merchant Two Demo Store', 'merchant-two-demo-store', 'A second merchant store for access testing'
from auth.users
where email = '<second-store-owner-email>'
on conflict (slug) do nothing;
