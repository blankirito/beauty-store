-- Manual TNG subscription-payment requests.
-- Merchants submit a transfer reference. Platform Admin verifies TNG
-- manually and grants a finite paid-access period.

create table if not exists public.store_payment_requests (
  id uuid primary key default gen_random_uuid(),

  store_id uuid not null
    references public.stores(id)
    on delete cascade,

  submitted_by_user_id uuid not null
    references auth.users(id)
    on delete restrict,

  plan_code text not null,
  monthly_price numeric(10, 2) not null
    check (monthly_price in (29, 59)),

  requested_months integer not null
    check (requested_months in (1, 3, 12)),

  requested_total_amount numeric(10, 2) not null
    check (requested_total_amount > 0),

  payer_name text not null
    check (char_length(btrim(payer_name)) between 1 and 120),

  tng_reference text not null
    check (char_length(btrim(tng_reference)) between 1 and 120),

  merchant_note text
    check (
      merchant_note is null
      or char_length(btrim(merchant_note)) <= 500
    ),

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),

  review_note text
    check (
      review_note is null
      or char_length(btrim(review_note)) <= 500
    ),

  reviewed_by_user_id uuid
    references auth.users(id)
    on delete restrict,

  reviewed_at timestamptz,

  approved_months integer
    check (
      approved_months is null
      or approved_months in (1, 3, 12)
    ),

  approved_total_amount numeric(10, 2)
    check (
      approved_total_amount is null
      or approved_total_amount > 0
    ),

  approved_access_ends_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (
    (
      status = 'pending'
      and reviewed_by_user_id is null
      and reviewed_at is null
      and approved_months is null
      and approved_total_amount is null
      and approved_access_ends_at is null
    )
    or (
      status = 'approved'
      and reviewed_by_user_id is not null
      and reviewed_at is not null
      and approved_months is not null
      and approved_total_amount is not null
      and approved_access_ends_at is not null
    )
    or (
      status = 'rejected'
      and reviewed_by_user_id is not null
      and reviewed_at is not null
      and nullif(btrim(coalesce(review_note, '')), '') is not null
      and approved_months is null
      and approved_total_amount is null
      and approved_access_ends_at is null
    )
  )
);

create index if not exists store_payment_requests_store_created_idx
  on public.store_payment_requests (store_id, created_at desc);

create unique index if not exists store_payment_requests_one_pending_per_store_idx
  on public.store_payment_requests (store_id)
  where status = 'pending';

alter table public.store_payment_requests enable row level security;

grant select on public.store_payment_requests to authenticated;

drop policy if exists "Owners and admins can view their store payment requests"
  on public.store_payment_requests;

create policy "Owners and admins can view their store payment requests"
  on public.store_payment_requests
  for select
  to authenticated
  using (
    public.is_platform_admin()
    or public.has_store_role(
      store_id,
      array['owner', 'admin']::public.store_member_role[]
    )
  );

create or replace function public.create_store_payment_request(
  p_store_id uuid,
  p_months integer,
  p_payer_name text,
  p_tng_reference text,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application_status public.store_application_status;
  v_plan_code text;
  v_founding_price_locked_until timestamptz;
  v_monthly_price numeric(10, 2);
  v_request_id uuid;
begin
  if not public.has_store_role(
    p_store_id,
    array['owner', 'admin']::public.store_member_role[]
  ) then
    raise exception 'Only a store owner or admin can submit a payment request.';
  end if;

  if p_months not in (1, 3, 12) then
    raise exception 'Choose 1, 3, or 12 months.';
  end if;

  if nullif(btrim(coalesce(p_payer_name, '')), '') is null then
    raise exception 'Enter the transfer payer name.';
  end if;

  if nullif(btrim(coalesce(p_tng_reference, '')), '') is null then
    raise exception 'Enter the TNG transfer reference.';
  end if;

  if char_length(btrim(p_payer_name)) > 120
    or char_length(btrim(p_tng_reference)) > 120
    or char_length(btrim(coalesce(p_note, ''))) > 500 then
    raise exception 'One or more payment details are too long.';
  end if;

  select status
  into v_application_status
  from public.store_applications
  where store_id = p_store_id;

  if not found or v_application_status not in (
    'trialing',
    'active',
    'past_due',
    'suspended'
  ) then
    raise exception 'This store cannot submit a subscription payment request.';
  end if;

  select
    plan_code,
    founding_price_locked_until
  into
    v_plan_code,
    v_founding_price_locked_until
  from public.store_subscriptions
  where store_id = p_store_id;

  if not found then
    raise exception 'This store does not have a subscription record.';
  end if;

  if v_plan_code = 'lumina-monthly-complimentary' then
    raise exception 'Complimentary access does not require payment.';
  end if;

  v_monthly_price := case
    when v_plan_code = 'lumina-monthly-founding'
      and v_founding_price_locked_until is not null
      and v_founding_price_locked_until > now()
      then 29
    else 59
  end;

  insert into public.store_payment_requests (
    store_id,
    submitted_by_user_id,
    plan_code,
    monthly_price,
    requested_months,
    requested_total_amount,
    payer_name,
    tng_reference,
    merchant_note
  )
  values (
    p_store_id,
    auth.uid(),
    v_plan_code,
    v_monthly_price,
    p_months,
    v_monthly_price * p_months,
    btrim(p_payer_name),
    btrim(p_tng_reference),
    nullif(btrim(coalesce(p_note, '')), '')
  )
  returning id into v_request_id;

  return v_request_id;
end;
$$;

create or replace function public.review_store_payment_request(
  p_request_id uuid,
  p_decision text,
  p_months integer default null,
  p_review_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.store_payment_requests%rowtype;
  v_current_period_ends_at timestamptz;
  v_new_period_ends_at timestamptz;
begin
  if not public.is_platform_admin() then
    raise exception 'Only platform administrators can review payment requests.';
  end if;

  select *
  into v_request
  from public.store_payment_requests
  where id = p_request_id
  for update;

  if not found or v_request.status <> 'pending' then
    raise exception 'This payment request is no longer pending.';
  end if;

  if p_decision = 'reject' then
    if nullif(btrim(coalesce(p_review_note, '')), '') is null then
      raise exception 'A rejection reason is required.';
    end if;

    update public.store_payment_requests
    set
      status = 'rejected',
      review_note = btrim(p_review_note),
      reviewed_by_user_id = auth.uid(),
      reviewed_at = now(),
      updated_at = now()
    where id = v_request.id;

    return;
  end if;

  if p_decision <> 'approve' then
    raise exception 'Choose approve or reject.';
  end if;

  if p_months not in (1, 3, 12) then
    raise exception 'Choose 1, 3, or 12 months.';
  end if;

  select current_period_ends_at
  into v_current_period_ends_at
  from public.store_subscriptions
  where store_id = v_request.store_id
  for update;

  if not found then
    raise exception 'This store does not have a subscription record.';
  end if;

  v_new_period_ends_at :=
    (
      case
        when v_current_period_ends_at is not null
          and v_current_period_ends_at > now()
          then v_current_period_ends_at
        else now()
      end
    )
    + make_interval(months => p_months);

  update public.store_applications
  set
    status = 'active',
    updated_at = now()
  where store_id = v_request.store_id
    and status in ('trialing', 'active', 'past_due', 'suspended');

  if not found then
    raise exception 'This store cannot receive paid subscription access.';
  end if;

  update public.store_subscriptions
  set
    status = 'active',
    current_period_ends_at = v_new_period_ends_at,
    payment_grace_ends_at = null,
    updated_at = now()
  where store_id = v_request.store_id;

  update public.store_payment_requests
  set
    status = 'approved',
    review_note = nullif(btrim(coalesce(p_review_note, '')), ''),
    reviewed_by_user_id = auth.uid(),
    reviewed_at = now(),
    approved_months = p_months,
    approved_total_amount = v_request.monthly_price * p_months,
    approved_access_ends_at = v_new_period_ends_at,
    updated_at = now()
  where id = v_request.id;
end;
$$;

revoke all on function public.create_store_payment_request(
  uuid,
  integer,
  text,
  text,
  text
) from public;

revoke all on function public.review_store_payment_request(
  uuid,
  text,
  integer,
  text
) from public;

grant execute on function public.create_store_payment_request(
  uuid,
  integer,
  text,
  text,
  text
) to authenticated;

grant execute on function public.review_store_payment_request(
  uuid,
  text,
  integer,
  text
) to authenticated;