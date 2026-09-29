# Admin workflow reliability and storefront New Arrivals

## Goal

Make the current merchant-admin and storefront flows safe for monkey testing by
removing misleading inert controls, completing the high-value controls, and
making the storefront New Arrivals experience use the real store catalogue.

This work is intentionally separate from Stripe. It does not introduce
customer Stripe checkout, browser push notifications, email notifications, or
real-time subscriptions.

## Scope and product decisions

### Admin list controls

The Products list will support Newest, Oldest, Name A-Z, and Stock low to
high sorting. Existing category and status chips remain the actual product
filters. The inert filter icon beside search is removed because it duplicates
those visible controls.

The Orders list will support All time and Last 30 days date ranges, plus
Newest and Oldest sort order. Its existing status chips remain. The inert
filter icon is removed. The overflow (three-dot) control is removed: all real
order operations belong on the existing order detail page. Export Orders will
download a CSV containing the currently filtered/sorted orders, including
order number, date, customer name/email, fulfilment status, payment status,
payment method, and total.

The Customers list will support Highest spent, Most recent, and Oldest
customer sorting. The existing status chips are the customer-tier filter, so
the duplicated inert Tiers control is removed. The inert filter icon is also
removed.

List filters, sorting, counts, pagination text, empty states, and CSV export
must all use the same filtered result set. Existing list pagination is a
display limit rather than server pagination and will remain so in this scope.

### Store owner card and inventory language

The repeated hardcoded owner card will be replaced by one shared card backed by
the authenticated current-user and store context. It will show the store name,
the signed-in member's real profile name, and their owner/admin role, with a
link to store settings. It must not display placeholder names, initials, or
subscription tiers.

The product metric currently labelled Low Stock will become Needs restocking,
with explanatory text that it includes products at or below their own restock
level. Product detail language will use the same meaning.

### In-app order notifications

New orders create in-app notifications for that store's owner and admins.
The admin header bell displays a real unread count and opens a small list of
recent notifications. A merchant can mark a notification read; opening an
order notification takes them to that order.

Notifications are refresh-to-update: a new order is visible after the next
admin page load or navigation. Browser push, email, polling, and Supabase
Realtime are explicitly out of scope for this launch-hardening pass.

After a checkout order is successfully created, the server action creates
notifications for the store's owner/admin members. A notification-write failure
is logged but cannot change a successful checkout into a failure. Notifications
are store-scoped and may only be read/updated by their intended authenticated
user.

### Customer Insights

Customer Insights remains because it provides concise, useful retention
information without needing new data collection. Returning-customer metrics
will count customers with two or more paid orders. Pending and cancelled
orders must not increase this metric. Total customer spend continues to count
paid orders only.

No predictive scoring, behavioural profiling, or complex segmentation is
introduced.

### Storefront New Arrivals

New Arrivals is driven by active products from the current public store,
ordered by actual product creation time descending.

The storefront home displays the latest four products and a View all link.
The New Arrivals entry point links to a new store-specific page:

```
/store/[slug]/collection/new-arrivals
```

That page displays up to 24 active products from that store, newest first,
and preserves the existing public-store eligibility rules. It does not use the
old global static product dataset.

## Security and correctness

- All admin data reads continue to resolve the signed-in user's store and
  existing membership permissions.
- Notification reads and state changes are constrained to their recipient and
  store.
- A notification is informational; it cannot bypass the existing order-detail
  authorization checks.
- CSV is generated from the merchant's already-authorized in-memory admin
  order data, without exposing another store's data.
- New Arrivals uses the existing public storefront data/access path and only
  includes active products.

## Verification

Automated tests cover sorting/date-range/filter helper behavior, paid-order
retention, CSV formatting, notification mapping/authorization helpers, and
new-arrivals ordering/limits.

Manual verification covers:

1. Product, order, and customer controls update visible results and counts.
2. Exported CSV matches the filtered order list.
3. A new checkout order appears as an unread owner/admin notification after
   refresh, opens the correct order, and can be marked read.
4. The owner card shows real store/user information.
5. The storefront home shows four newest active products and View all opens
   the store-specific New Arrivals page with newest-first products.
