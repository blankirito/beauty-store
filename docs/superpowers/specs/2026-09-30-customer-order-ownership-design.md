# Customer Order Ownership Design

## Purpose

Ensure that an authenticated customer who completes checkout can find that
order in the same store's Profile and Orders pages, while retaining the
existing private token-based tracking flow for guest checkout.

The current production behaviour is that an order is successfully created and
visible to merchant Admin, but it is not visible to its logged-in customer.
This occurs because the server-side checkout path creates every order without
a `customer_id`.

## Confirmed Scope

This change applies to a customer who is signed in while checking out at a
public store route such as `/store/[slug]/checkout`.

- The new order is associated with that authenticated customer.
- It appears in `/store/[slug]/orders` for that customer only.
- The customer can open the store-scoped order detail and tracking view.
- Merchant Admin continues to see and process all store orders unchanged.
- A guest can still place an order and use its tracking token; a guest order
  remains unassociated with a customer account.

The change does not retroactively guess the owner of already-created guest
orders. Historic orders without a `customer_id` remain available through the
original token-based route.

## Design

### Trusted customer identity

`submitGuestCheckout` remains the public checkout entry point so existing
client components and guest checkout inputs do not change. Before calling the
privileged database client, the server action reads the authenticated user
from the request-bound Supabase server client.

It passes only that server-derived user ID, or `null` when no user is signed
in, to the order-creation RPC. The browser never supplies a customer ID, so a
customer cannot claim another account's orders.

### Database contract

A new migration replaces the server-only
`create_guest_checkout_order` function with a version accepting one optional
`p_customer_id uuid` argument. The function writes this value to
`orders.customer_id` during its existing single transaction.

The existing public-store eligibility check, payment-method verification,
stock locking, order items, shipping address, tracking token, and order-event
creation remain unchanged. The function remains executable only by
`service_role`; grants are revoked for all other roles using the new function
signature.

The tracking token is still created for every order. This preserves the
current guest tracking outcome and provides a safe fallback for customers who
received a checkout confirmation link.

### Customer visibility

The existing store-scoped Orders page already filters by both `store_id` and
the signed-in user's `customer_id`, and the detail route uses the same
ownership condition. No relaxation of those queries is permitted. Once the
checkout transaction stores the correct customer ID, these pages show only
the correct customer's orders without exposing another customer's data.

The legacy global `/orders` route is out of scope for the database fix. It
uses static demonstration data and must not be presented as the source of
truth for live store orders. The customer-facing paths to validate for launch
are `/store/[slug]/profile` and `/store/[slug]/orders`.

## Error Handling and Safety

- Failure to read the authenticated user treats the request as a guest only
  when the request has no valid session; it never accepts an ID supplied in
  form data or client state.
- The checkout action continues to return its existing safe checkout errors.
- A guest checkout submits `null` and cannot acquire an account association.
- The existing Row Level Security customer ownership condition remains the
  final authorization boundary for reading orders.
- Existing orders are not bulk-updated, preventing unsafe ownership guesses
  based on email addresses or customer names.

## Testing and Launch Verification

Add focused tests around the checkout request construction or a small
extracted helper to prove that a server-derived authenticated user ID is
included and an absent user becomes `null`. Add a migration-level or
integration validation using a signed-in test customer where feasible.

Before deployment:

1. Run the focused checkout/order tests, then the full test suite and
   production build.
2. Sign in as a customer, purchase from a store, and confirm the new order
   appears in that store's Profile and Orders views.
3. Open the order detail from the customer page and confirm tracking and
   events are visible.
4. Confirm the same order remains visible in merchant Admin and can be
   processed.
5. Place one order while signed out; confirm it does not appear in an account
   order list but its private token tracking link continues to work.

## Out of Scope

- Matching historical guest orders to accounts by email, phone, or name.
- Changing payment methods, stock reservation, notifications, or merchant
  order processing.
- Replacing or redesigning the legacy global static `/orders` demonstration
  routes.
- Customer order cancellation, returns, invoices, or account-merging flows.
