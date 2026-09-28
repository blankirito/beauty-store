# Merchant Subscription and Platform Admin Design

## Purpose

Finish the subscription experience for Lumina merchants before live payment
integration. Merchants receive a 14-day free trial, then subscribe to the
Lumina Store monthly plan. The platform administrator can see subscription
health across every merchant store.

This phase creates real entitlement and UI data, but does not collect money,
store payment details, or call Stripe.

## Product Rules

- Every approved merchant begins a 14-day free trial without entering a card.
- The standard plan costs RM59 per month.
- The first ten merchants approved by a platform administrator receive the
  founding plan at RM29 per month for twelve months.
- A platform administrator may manually grant or remove complimentary access
  for any merchant. Complimentary access has no automatic expiry and cannot
  be selected by the merchant.
- Founding eligibility is assigned at approval time and never changes because
  another merchant later cancels or is suspended.
- A merchant must not be able to choose, change, or submit their own price.
- Trialling and active stores are publicly eligible. Pending, rejected,
  past-due, and suspended stores are not publicly eligible.
- Stripe will become the authoritative source for post-checkout billing state
  in a later phase. A browser redirect must never grant a paid entitlement.

Removing complimentary access returns the merchant to the RM59 standard plan
and begins a seven-day payment grace period before suspension. The platform
administrator may record an internal reason such as `Family business`; that
reason is never shown to the merchant.

## Subscription Data

`store_subscriptions` remains the subscription record for one store.

- `plan_code` is `lumina-monthly` for the RM59 plan or
  `lumina-monthly-founding` for the RM29 plan.
- `plan_code` is `lumina-monthly-complimentary` while platform-admin-granted
  complimentary access is active.
- `founding_price_locked_until` is set to twelve months after approval only
  for a founding merchant. It remains null for the standard plan.
- `status` remains `not_started` until Stripe is integrated; application
  lifecycle status determines trial access in this phase.
- `provider_customer_id`, `provider_subscription_id`, and
  `current_period_ends_at` remain reserved for the Stripe phase.

Complimentary state also requires `complimentary_reason` (platform-only) and
`payment_grace_ends_at` (set when the override is removed).

The approval transaction must count and assign founding plans inside the
database. Client-side or server-side UI counting alone is not sufficient,
because two approvals could happen at the same time.

## Merchant Experience

### Dashboard reminder

The merchant dashboard shows one compact subscription card:

- During trial: remaining days, trial end date, and a link to Billing.
- During active paid subscription: current plan and next billing date.
- During past due or suspended status: an honest recovery message and a link
  to Billing.
- During complimentary access: a no-price access message with no checkout
  action.

The card does not claim payment functionality is available before Stripe is
connected.

### Billing page

`/admin/billing` follows the supplied Stitch design while using real data:

- merchant/store identity and subscription status badge;
- trial remaining days, expiry date, and progress bar where relevant;
- the assigned RM29 or RM59 monthly plan;
- complimentary access without a displayed price or checkout action;
- founding-lock expiry when applicable;
- only product benefits that Lumina can genuinely provide;
- a disabled, clearly labelled future checkout action;
- billing-history empty state until Stripe invoices exist.

The original Stitch `$49`, fixed date, fixed store name, fake checkout
animation, and unverified benefits are not used.

## Platform Admin Experience

`/platform` remains the owner-only overview and becomes the source of truth
for high-level subscription health:

- counts for trialling, founding-plan, standard-plan, past-due, and suspended
  stores;
- complimentary stores and controls to grant or remove that access;
- a link to a subscription list;
- no fake recurring revenue while no payments have been collected.

The subscription list shows only platform-administrator-visible merchant
information: store name, lifecycle status, assigned plan, trial end, founding
lock end, and later Stripe billing status. It does not expose bank or card
details.

## Navigation

- Desktop merchant navigation gains a Billing item.
- Mobile merchant bottom navigation uses Billing in place of Analytics to
  match the provided Stitch five-item layout. Analytics remains reachable
  from the mobile side menu.
- Platform navigation continues to keep Billing as a distinct owner-only
  section.

## Test and Verification Plan

Before live payments:

1. Unit-test founding-plan assignment for the first ten approvals and the
   standard plan for the eleventh.
2. Unit-test complimentary access and the RM59 grace state after it is
   removed.
3. Unit-test billing display data for trial, founding, standard, and recovery
   states.
4. Test that merchant-facing data is restricted to the current merchant store.
5. Test that platform-only subscription data is unavailable to merchants.
6. Run targeted Vitest suites and `npm run build` locally.

## Deferred: Stripe Live Payments

After the UI phase and after the platform owner has a suitable registered
business/payment setup:

- create Stripe products and RM59/RM29 recurring prices;
- create a Stripe Checkout Session for the server-selected price;
- add verified, idempotent Stripe webhooks and a subscription event ledger;
- enable Stripe Customer Portal for payment-method updates and cancellation;
- create invoices/receipts from Stripe and confirm Malaysian tax and
  e-Invoice requirements with an accountant;
- add payment-failure reminders, a seven-day grace period, and recovery
  controls.

No production payment key, bank account, or card data is introduced before
this later phase.
