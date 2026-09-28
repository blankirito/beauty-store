-- Assign the founding price to exactly the first ten approved merchants.
-- This runs inside the same transaction as the store-approval lifecycle update.

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
declare
  v_founding_plan_count integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Only platform administrators can review stores.';
  end if;

  if p_decision = 'approve' then
    -- Serialise approvals so two simultaneous approvals cannot both claim
    -- the final founding-plan position.
    perform pg_advisory_xact_lock(78245901);

    select count(*)::integer
    into v_founding_plan_count
    from public.store_subscriptions
    where plan_code = 'lumina-monthly-founding';

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

    if not found then
      raise exception 'This store cannot receive that review decision.';
    end if;

    update public.store_subscriptions
    set
      plan_code = case
        when v_founding_plan_count < 10
          then 'lumina-monthly-founding'
        else 'lumina-monthly'
      end,
      founding_price_locked_until = case
        when v_founding_plan_count < 10
          then now() + interval '12 months'
        else null
      end,
      updated_at = now()
    where store_id = p_store_id;

    if not found then
      raise exception 'This store does not have a subscription record.';
    end if;

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