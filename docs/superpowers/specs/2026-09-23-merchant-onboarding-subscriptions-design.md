# Merchant Onboarding and Subscription Design

## Purpose

Turn the existing multi-tenant storefront into a merchant SaaS platform. A merchant can create an account, apply to open one store, prepare its catalog, and begin a 14-day trial only after platform approval. The platform owner controls public availability. This is separate from a merchant's shopper checkout payments.

## Roles

- **Platform administrator:** reviews store applications and may approve, reject, suspend, or restore any merchant store.
- **Merchant owner:** can access and manage only the store to which they belong.
- **Shopper:** can access only stores that are publicly eligible to sell.

The first release supports one owner and one store per merchant account. Multi-store and staff memberships are future work.

## Store lifecycle

`draft -> pending_review -> trialing -> active`

Other terminal or intervention states are `rejected`, `past_due`, and `suspended`.

- A registration creates a `draft` store.
- After required application details are submitted, it becomes `pending_review`.
- Approval changes it to `trialing`, sets a 14-day trial end time, and permits public storefront access.
- A paid subscription changes it to `active`.
- A failed renewal moves it to `past_due`; a seven-day grace period applies in the later billing phase.
- A still-unpaid or manually disabled store becomes `suspended`. Its public storefront is unavailable, while its merchant admin and data remain accessible for recovery.
- A rejected application remains private and can later be revised and resubmitted.

Existing operating stores, including Boutique Demo Store, must be migrated safely to an eligible public state.

## Merchant flow

1. Merchant signs up using email and password, then verifies email.
2. Merchant supplies store name, category, contact name, phone number, and short store description. The requested store slug is checked for availability.
3. The merchant may save the application as a draft, then submit it for review.
4. While pending, the merchant can enter admin to prepare products and settings but cannot publish or accept public shopper orders.
5. The platform administrator approves or rejects the application. Rejection has a visible reason and supports resubmission.
6. Approval starts the 14-day trial and makes the storefront available.

## Subscription rules

The product charges the merchant a monthly SaaS fee. It does not take or split the merchant's shopper order payments in this phase.

- Start with one monthly plan.
- The standard monthly price is **RM59**. The first ten approved merchants may receive a **RM29/month founding price**, locked for twelve months.
- The trial does not require a card.
- Merchant billing uses Stripe-hosted subscription checkout and its customer portal in the later Stripe integration phase.
- Stripe webhooks are the authoritative source for paid, failed, cancelled, and renewed subscription state.
- The application records provider customer/subscription IDs and processed event IDs for idempotency; browser redirects never grant entitlement by themselves.
- Before payment integration, the Billing page shows trial/status information and the data model reserves subscription fields.

## Routes and pages

- `/`: public platform marketing and merchant registration entry point.
- `/onboarding`: sign-up and store application wizard.
- `/admin`: merchant-scoped administration for the current merchant store.
- `/admin/billing`: merchant trial/subscription status and future billing entry point.
- `/platform`: platform-owner-only overview.
- `/platform/store-applications`: application review queue.
- `/platform/stores`: store status and suspension management.

`/platform` is separate from `/admin` so merchants can never reach platform-wide controls through URL changes.

## Data and authorization

The implementation will use the existing `profiles` and `stores` concepts plus explicit membership and subscription records:

- `store_members`: account-to-store membership and owner role.
- `store_subscriptions`: provider identifiers, plan, status, trial end, and current period end.
- `platform_admins`: platform-owner authorization.
- `subscription_events`: Stripe webhook event audit and idempotency ledger.

All database policies and server-side queries must scope merchant data by authorized `store_id`. Merchants cannot grant themselves public eligibility, alter trial dates, or read another merchant's data. Only a platform administrator can approve, reject, suspend, or restore a store. Public queries must accept only published stores in `trialing` or `active` status.

## First-release scope

Included:

- email/password merchant registration and verification;
- application draft/save/submit workflow;
- platform review, approval, rejection, and suspension;
- store lifecycle and 14-day trial entitlement;
- merchant Billing status page;
- public-store access enforcement;
- migration safety for current demo store.

Deferred:

- live Stripe checkout, webhooks, invoices, and customer portal;
- plan tiers, annual plans, discounts, upgrades, and downgrades;
- payment-failure emails and automated reminders;
- multi-store ownership and staff roles;
- marketplace payment splitting;
- unrelated completion of merchant dashboard, customers, analytics, profile, shopper search, and shopper profile.

## Error handling and verification

- Invalid, duplicate, or incomplete applications remain private and show actionable validation feedback.
- Rejected applications show the review reason and can be resubmitted.
- Unauthorized access to `/platform` returns no platform data.
- A suspended, pending, or rejected store has no usable public storefront, cart, checkout, or shopper order route.
- Tests must cover each legal state transition, tenant isolation, public-access enforcement, and protection of the current demo store.
- End-to-end checks must cover registration, draft save, application submit, administrator approval, trial access, suspension, and merchant recovery access.

## UI direction

After this specification is approved, use Google Stitch only for the new system's five key screens: registration, onboarding, merchant dashboard, platform application review, and Billing/trial status. Match the existing boutique design system; use Stitch as a visual reference rather than copying generated code wholesale.
