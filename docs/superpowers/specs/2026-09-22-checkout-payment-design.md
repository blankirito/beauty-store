# Checkout and Payment Architecture

## Goal

Build a reusable checkout and payment system for multiple stores.
Each store controls its own enabled payment methods, while orders,
payment states, inventory, and fulfillment remain reliable and separate.

## Core Rules

- Payment status and fulfillment status are independent.
- The browser never decides product prices, stock, or payment validity.
- Orders preserve snapshots of items, addresses, and payment method labels.
- Sensitive payment details such as card numbers and CVC are never stored.
- One checkout may create one order per store when a cart contains products
  from multiple stores.

## Payment Methods

Add `store_payment_methods` for store-level configuration.

Each method includes:

- `store_id`
- stable method code, such as `cash_on_delivery`, `bank_transfer`, or a future provider code
- customer-facing label
- customer instructions
- enabled state
- display order
- timestamps

Only enabled methods may be selected during checkout.

Orders save the chosen payment method as a snapshot. Renaming or disabling a
method later does not change historic orders.

For multi-store checkout, the cart is grouped by store and the customer
selects one enabled payment method for each resulting store order.

## Payment States

Orders use these independent payment states:

- `pending`
- `paid`
- `failed`
- `refunded`

Rules:

- COD orders begin as `pending` and may be fulfilled before payment is confirmed.
- Bank-transfer orders begin as `pending` until an authorized administrator confirms payment.
- Future online payment providers update the state through verified server-side callbacks.
- Payment changes create append-only payment events and visible order timeline entries.

## Checkout and Inventory

Checkout submits only product IDs, quantities, address details, and the selected
payment method. A server-side database operation must:

1. Allow guest checkout or an authenticated customer checkout.
   When the customer is authenticated, attach their profile ID to the order.
   When the customer is a guest, keep customer_id empty and use their
   submitted email, phone, and shipping address.
2. Reload products from the database.
3. Confirm products are active and belong to the relevant store.
4. Confirm sufficient stock under concurrency.
5. Confirm the selected payment method is enabled for that store.
6. Create the order, item snapshots, shipping-address snapshot, and initial event.
7. Reserve or deduct inventory atomically.
8. Return real order numbers.

For COD, inventory is deducted when the order is accepted.

For pending bank-transfer and future online-payment orders, inventory is reserved
for 24 hours. If payment is not completed in time, the order is cancelled,
inventory is returned, and an event is recorded.

## Authorization

- Customers can create and view only their own orders.
- Store owners and admins can view and manage orders for their store.
- Store owners and admins can confirm payment, issue refunds, and manage payment methods.
- Staff may receive read-only order access unless a later role rule explicitly expands it.
- Every server action and database function independently enforces authorization.

## Guest Checkout and Order Access

- Customers may place an order without creating an account.
- Guest orders keep customer_id empty while preserving submitted contact and
  shipping snapshots.
- Each guest order receives a cryptographically random access token.
- Only a hash of that token is stored in the database.
- The raw token is returned only immediately after checkout and is later sent
  in the order-confirmation email as part of the tracking link.
- A guest may view an order or its tracking page only with that secret token.
  Order numbers alone must never grant access.
- Authenticated customers may view orders belonging to their own profile.
- Customers can later create an account using the same verified email; a later
  account-claim flow may connect their earlier guest orders.

## Customer Experience

- Checkout allows guests to provide contact details, delivery address, and an
  enabled payment method without first creating an account.
- Checkout shows only enabled payment methods for the relevant store.
- After a guest order succeeds, the customer sees a secure tracking link and
  may optionally create an account for future orders.
- The success page shows actual order numbers.
- The customer order center shows real orders owned by the signed-in user.
- The tracking page shows payment state, fulfillment state, tracking details,
  and order events.
- Cancelled or expired payment reservations are explained clearly.

## Delivery Plan

1. Payment method database configuration and admin foundation.
2. Atomic checkout order creation and inventory reservation.
3. Real order-success page, customer order center, and tracking page.
4. Admin payment confirmation, payment events, and expired-reservation release.
5. Future online payment providers and carrier webhooks.

## Verification

Each phase uses test-first development and is verified with:

- focused tests for pure business rules
- authorization and database-operation checks
- full `npm test`
- `npm run build`
- manual user-flow testing