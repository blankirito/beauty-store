# Manual TNG Subscription Design

## Purpose

Let Lumina charge its early merchants through manual TNG transfers without
collecting card details or integrating Stripe. A merchant submits a payment
request in the product; a platform administrator verifies the transfer in
TNG and grants a finite paid-access period. The system keeps payment records,
protects store access, and reminds merchants when action is needed.

## Confirmed Decisions

- TNG is the only accepted payment method for this phase. Bank transfer,
  Stripe Checkout, card collection, automatic reconciliation, screenshots,
  email, and invoice generation are out of scope.
- A payment request records the payer name and TNG transfer reference. The
  payer name and reference are required; a merchant note is optional.
- Merchants may request one, three, or twelve months. The server calculates
  the requested price from the store's existing Standard or founding plan;
  it never trusts a browser-supplied amount.
- A platform administrator must verify every request in TNG before approving
  it. A rejection requires a short reason and lets the merchant submit a new
  request.
- Complimentary access remains exclusively for genuinely free access. It
  must never represent a paid TNG subscription.
- The admin-dashboard billing card is visible only while a merchant needs
  billing attention: free trial, payment needed, an upcoming expiry/grace
  state, or suspended. It is hidden during an ordinary active paid period.

## Data Model and Authority

Add a `store_payment_requests` table with one row per submission:

- Store and submitter IDs.
- Plan code and monthly-price snapshot.
- Requested duration in months and computed total amount.
- Payer name, TNG reference, optional merchant note.
- Status: `pending`, `approved`, or `rejected`.
- Submitted, reviewed, and approved access-end timestamps, plus reviewer ID
  and rejection/review note.

Row-level security permits owners and store admins to create and read only
their own store's requests. Only platform admins may review requests.
Database RPCs independently enforce these checks; server actions are not the
only authorization boundary.

`store_subscriptions` remains the single access entitlement. Approving a
request sets the subscription and application to `active`, sets
`current_period_ends_at`, and records the approved request. The new endpoint
is calculated from the later of the current active period end and the current
time, then extended by the approved one, three, or twelve months. This keeps
prepaid days intact.

Only one pending request may exist for each store at a time. A rejected
request remains historical but does not block a replacement request.

## Merchant Experience

The Billing & Subscription page displays TNG payment instructions from server
configuration: a recipient display name and TNG number. These values are
configured as deployment environment variables, not hard-coded in a client
component. They are intentionally visible to merchants but are not secrets.

The merchant can select one, three, or twelve months, see the server-derived
plan price, and submit payer name, reference, and an optional note. A pending
request replaces the submission form with a clear awaiting-review state. A
rejection displays its reason and enables a new submission.

An active merchant can still view Billing & Subscription and submit a renewal
before expiry. The homepage/dashboard Billing card is only shown when its
status is trialling, payment-needed, near expiry/grace, or suspended; it is
not shown during a routine active period.

## Platform Experience

Platform Subscriptions gains a dedicated pending-payments queue and request
history on each merchant's subscription card. A platform administrator sees
the submitted amount, plan, duration, payer name, reference, note, and date.

Approving applies the selected duration and shows the computed new expiry
before confirmation. Rejecting requires a concise merchant-visible reason.
The existing complimentary controls remain separate and clearly labelled.

## Lifecycle and Reminders

The existing protected lifecycle reconciliation continues to own time-based
status changes. It is extended so that an active paid subscription whose
`current_period_ends_at` has passed becomes `past_due` and receives the
existing seven-day payment grace period. A grace period expiry suspends the
store. Public-store eligibility continues to follow active, valid trial, or
valid grace access only.

Dashboard and billing reminders use current period and grace dates so they
appear before an active paid period ends, during the grace period, and after
suspension. No email or push reminder is included in this phase.

## Error Handling

- Missing TNG configuration gives the merchant a safe support message rather
  than exposing an incomplete payment form.
- Invalid duration, duplicate pending request, unavailable subscription, or
  unauthorized store access returns a clear validation error without changing
  entitlement.
- An approval is transactional: the request and subscription update succeed
  together or neither changes.
- Platform review pages surface loading failures without treating a payment as
  approved.

## Verification

- Unit tests cover monthly totals, plan pricing, valid durations, duplicate
  pending-request prevention, and period extension from both now and a future
  expiry.
- Tests cover reminder/dashboard visibility for trialling, pending payment,
  active near-expiry, active ordinary period, grace, and suspended states.
- Database migration review verifies RLS, RPC authorization, and the active
  subscription expiry transition.
- Focused tests, the full `npm test` suite, `npm run build`, and manual test
  of submit, reject, approve, renewal, expiry, and public-store suspension
  are required before deployment.
