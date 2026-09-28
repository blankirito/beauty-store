# Checkout and Customer Security Design

## Goal

Make guest checkout safe enough for Lumina's pre-online-payment phase while
showing every non-cancelled purchaser in merchant Customers immediately.

## Confirmed Product Rules

- Guest checkout remains available.
- An order starts as `pending`; it becomes `paid` only when a merchant has
  verified a bank transfer or received COD cash.
- Fulfilment and payment are independent. Delivered does not imply paid.
- A customer appears after any non-cancelled order, including a pending order.
- Revenue, total spent, VIP qualification, and paid-order analytics include
  only paid orders.
- Pending payment is a separate customer-facing-to-merchant label, not a
  replacement for New, Active, or VIP customer relationship status.

## Security and Inventory

- Ordinary authenticated users must never update `profiles.is_platform_admin`.
- Browser clients must not directly execute an inventory-decrementing checkout
  RPC.
- Checkout uses a server-side endpoint that applies duplicate-submission and
  basic abuse limits before invoking a database order function.
- Pending orders reserve inventory and record a payment expiry. A cancellation
  or expiry returns inventory exactly once.
- Marking an order paid is an owner/admin-only database operation and appends
  an order event.

## Lifecycle and Platform Follow-up

- Preserve founding entitlement while a merchant has complimentary access.
- Restrict complimentary removal to currently complimentary subscriptions.
- Use a protected Vercel Cron endpoint to reconcile expired trials, payment
  grace periods, and expired pending-order reservations.
- Add Platform reject and suspend controls, and complete subscription metrics.

## Non-goals

This phase does not collect payment details, connect a provider, create
invoices, or grant paid access from a browser redirect.
