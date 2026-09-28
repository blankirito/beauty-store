-- Reconcile time-based merchant subscription states.
-- Trial expiry starts a seven-day payment grace period.
-- A grace period expiry suspends the merchant store.

create or replace function public.reconcile_store_subscription_lifecycle()
returns table (
  trials_expired integer,
  stores_suspended integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trials_expired integer := 0;
  v_stores_suspended integer := 0;
begin
  with expired_trials as (
    update public.store_applications application
    set
      status = 'past_due',
      updated_at = now()
    where application.status = 'trialing'
      and application.trial_ends_at is not null
      and application.trial_ends_at <= now()
    returning application.store_id
  )
  update public.store_subscriptions subscription
  set
    status = 'past_due',
    payment_grace_ends_at = coalesce(
      subscription.payment_grace_ends_at,
      now() + interval '7 days'
    ),
    updated_at = now()
  from expired_trials
  where subscription.store_id = expired_trials.store_id;

  get diagnostics v_trials_expired = row_count;

  with expired_grace_periods as (
    update public.store_applications application
    set
      status = 'suspended',
      updated_at = now()
    from public.store_subscriptions subscription
    where subscription.store_id = application.store_id
      and application.status = 'past_due'
      and subscription.payment_grace_ends_at is not null
      and subscription.payment_grace_ends_at <= now()
    returning application.store_id
  )
  update public.store_subscriptions subscription
  set
    status = 'suspended',
    updated_at = now()
  from expired_grace_periods
  where subscription.store_id = expired_grace_periods.store_id;

  get diagnostics v_stores_suspended = row_count;

  return query
  select v_trials_expired, v_stores_suspended;
end;
$$;

revoke all on function public.reconcile_store_subscription_lifecycle()
from public, anon, authenticated;

grant execute on function public.reconcile_store_subscription_lifecycle()
to service_role;

select cron.schedule(
  'reconcile-store-subscription-lifecycle',
  '0 * * * *',
  $$
    select public.reconcile_store_subscription_lifecycle();
  $$
);