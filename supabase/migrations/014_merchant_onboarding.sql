-- Merchant onboarding, application lifecycle, and trial entitlement.
-- Do not run this migration by itself. Apply it together with the
-- public-store eligibility migration that follows.

do $$
begin
  create type public.store_application_status as enum (
    'draft',
    'pending_review',
    'trialing',
    'active',
    'past_due',
    'suspended',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.store_applications (
  store_id uuid primary key
    references public.stores(id) on delete cascade,
  status public.store_application_status not null default 'draft',
  category text,
  contact_name text,
  contact_phone text,
  review_note text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_subscriptions (
  store_id uuid primary key
    references public.stores(id) on delete cascade,
  provider_customer_id text unique,
  provider_subscription_id text unique,
  plan_code text not null default 'lumina-monthly',
  status text not null default 'not_started',
  current_period_ends_at timestamptz,
  founding_price_locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists store_applications_status_submitted_at_idx
  on public.store_applications (status, submitted_at);

alter table public.store_applications enable row level security;
alter table public.store_subscriptions enable row level security;

grant select on public.store_applications to authenticated;
grant select on public.store_subscriptions to authenticated;

drop policy if exists "Members can view their own store application"
  on public.store_applications;

create policy "Members can view their own store application"
  on public.store_applications
  for select
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_store_role(
      store_id,
      array['owner', 'admin', 'staff']::public.store_member_role[]
    )
  );

drop policy if exists "Members can view their own store subscription"
  on public.store_subscriptions;

create policy "Members can view their own store subscription"
  on public.store_subscriptions
  for select
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_store_role(
      store_id,
      array['owner', 'admin']::public.store_member_role[]
    )
  );

create or replace function public.is_public_store_eligible(
  p_store_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.store_applications
    where store_id = p_store_id
      and (
        status = 'active'
        or (
          status = 'trialing'
          and trial_ends_at is not null
          and trial_ends_at > now()
        )
      )
  );
$$;

create or replace function public.create_store_application(
  p_name text,
  p_slug text,
  p_category text,
  p_contact_name text,
  p_contact_phone text,
  p_description text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_store_id uuid;
  v_slug text := lower(btrim(p_slug));
begin
  if auth.uid() is null then
    raise exception 'Sign in to create a store application.';
  end if;

  if btrim(p_name) = ''
    or v_slug = ''
    or btrim(p_category) = ''
    or btrim(p_contact_name) = ''
    or btrim(p_contact_phone) = ''
    or btrim(p_description) = '' then
    raise exception 'Complete all required store application details.';
  end if;

  if char_length(p_description) > 240 then
    raise exception 'Store description must be 240 characters or fewer.';
  end if;

  if v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Enter a valid store URL.';
  end if;

  if v_slug = any (
    array['admin', 'platform', 'login', 'register', 'onboarding', 'store']
  ) then
    raise exception 'This store URL is reserved.';
  end if;

  if exists (
    select 1
    from public.store_members
    where user_id = auth.uid()
      and role = 'owner'
  ) then
    raise exception 'This account already owns a store.';
  end if;

  if exists (
    select 1
    from public.stores
    where slug = v_slug
  ) then
    raise exception 'This store URL is already taken.';
  end if;

  insert into public.stores (
    owner_id,
    name,
    slug,
    description,
    is_active
  )
  values (
    auth.uid(),
    btrim(p_name),
    v_slug,
    btrim(p_description),
    false
  )
  returning id into v_store_id;

  insert into public.store_applications (
    store_id,
    category,
    contact_name,
    contact_phone
  )
  values (
    v_store_id,
    btrim(p_category),
    btrim(p_contact_name),
    btrim(p_contact_phone)
  );

  insert into public.store_subscriptions (store_id)
  values (v_store_id);

  return v_store_id;
end;
$$;

create or replace function public.submit_store_application(
  p_store_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_store_role(
    p_store_id,
    array['owner']::public.store_member_role[]
  ) then
    raise exception 'You cannot submit this store application.';
  end if;

  update public.store_applications
  set
    status = 'pending_review',
    submitted_at = now(),
    review_note = null,
    updated_at = now()
  where store_id = p_store_id
    and status in ('draft', 'rejected');

  if not found then
    raise exception 'Only a draft or rejected application can be submitted.';
  end if;
end;
$$;

create or replace function public.review_store_application(
  p_store_id uuid,
  p_decision text,
  p_review_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Only platform administrators can review stores.';
  end if;

  if p_decision = 'approve' then
    update public.store_applications
    set
      status = 'trialing',
      reviewed_at = now(),
      trial_started_at = now(),
      trial_ends_at = now() + interval '14 days',
      review_note = null,
      updated_at = now()
    where store_id = p_store_id
      and status = 'pending_review';

  elsif p_decision = 'reject' then
    if nullif(btrim(coalesce(p_review_note, '')), '') is null then
      raise exception 'A rejection reason is required.';
    end if;

    update public.store_applications
    set
      status = 'rejected',
      reviewed_at = now(),
      review_note = btrim(p_review_note),
      updated_at = now()
    where store_id = p_store_id
      and status = 'pending_review';

  elsif p_decision = 'suspend' then
    update public.store_applications
    set
      status = 'suspended',
      reviewed_at = now(),
      review_note = nullif(btrim(coalesce(p_review_note, '')), ''),
      updated_at = now()
    where store_id = p_store_id
      and status in ('trialing', 'active', 'past_due');

  else
    raise exception 'Choose approve, reject, or suspend.';
  end if;

  if not found then
    raise exception 'This store cannot receive that review decision.';
  end if;
end;
$$;

revoke all on function public.create_store_application(
  text, text, text, text, text, text
) from public;

revoke all on function public.submit_store_application(uuid)
  from public;

revoke all on function public.review_store_application(uuid, text, text)
  from public;

grant execute on function public.create_store_application(
  text, text, text, text, text, text
) to authenticated;

grant execute on function public.submit_store_application(uuid)
  to authenticated;

grant execute on function public.review_store_application(uuid, text, text)
  to authenticated;

insert into public.store_applications (
  store_id,
  status,
  trial_started_at
)
select
  id,
  'active',
  now()
from public.stores
where slug = 'boutique-demo-store'
on conflict (store_id) do nothing;

insert into public.store_subscriptions (store_id)
select id
from public.stores
where slug = 'boutique-demo-store'
on conflict (store_id) do nothing;