# Platform Lifecycle Completion Design

## Purpose

Complete Lumina's non-payment platform operations before live checkout is
introduced. The platform administrator must be able to make safe review and
access decisions, while expired trials and grace periods are reconciled
automatically after deployment on Vercel.

## Confirmed Decisions

- Vercel is the production host and already deploys automatically from pushes
  to `main`.
- No live payment provider, card collection, invoice creation, or checkout is
  included in this phase.
- The first ten approved merchants retain their RM29 entitlement for twelve
  months even if they temporarily receive complimentary access.
- A trial expires directly to `suspended` when no paid subscription exists.
- A complimentary-access removal gives a seven-day RM59 grace period; when
  that deadline expires, the store becomes `suspended`.
- Rejecting an application requires a platform-only reason. Suspending a
  merchant allows an optional platform-only note.

## Data Integrity

`founding_price_locked_until` is the immutable record of a founding
entitlement. Granting complimentary access must not clear it. Removing
complimentary access restores `lumina-monthly-founding` while that timestamp
is still in the future; otherwise it restores `lumina-monthly`.

Founding eligibility is counted using the existence of that entitlement, not
the mutable current `plan_code`. This prevents complimentary access from
freeing and reassigning one of the first ten places.

The database function that removes complimentary access must update only a
subscription whose current plan is `lumina-monthly-complimentary`.

## Automated Lifecycle

A database reconciliation function is the only code that changes a store for
time expiry:

- trialling applications whose `trial_ends_at` is at or before the current
  time become `suspended` when their subscription is not active or
  complimentary;
- `past_due` applications whose `payment_grace_ends_at` is at or before the
  current time become `suspended`.

A protected Next.js route invokes this function. Vercel Cron calls that route
once daily at 00:00 UTC (08:00 Malaysia time). The route accepts only a
matching `Authorization: Bearer <CRON_SECRET>` header. The secret is stored in
Vercel's production environment settings and is never committed.

## Platform Experience

The review queue offers Approve, Reject, and a required rejection note.
Subscription cards offer Grant complimentary access, Remove complimentary
access, and Suspend for eligible merchant states. Server actions and database
functions independently verify platform-admin access.

The Platform overview displays live counts for trialling, founding, standard,
complimentary, payment-needed, and suspended stores. It does not display
revenue until a payment provider is authoritative.

Complimentary merchants see no price, checkout control, payment instruction,
or billing-history section. They see only that access is managed by Lumina
Admin.

## Verification

- Unit tests prove founding entitlement survives complimentary access and that
  an invalid remove request is rejected by decision logic.
- Unit tests prove the lifecycle reconciler selects expired trials and expired
  grace periods, but not active entitlements.
- Focused tests, the complete `npm test` suite, `npm run build`, and manual
  Vercel Cron verification are required before release.
