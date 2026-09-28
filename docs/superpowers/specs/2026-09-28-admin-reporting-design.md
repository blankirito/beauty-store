# Admin Reporting Design

## Goal

Replace mock data in the Admin Dashboard, Customers, and Analytics pages with store-scoped Supabase data that is consistent across every page.

## Scope

### Time periods

Analytics supports 7 Days, 30 Days, This Month (default), and This Year. Period boundaries and displayed dates use `Asia/Kuala_Lumpur`.

### Valid revenue

Revenue and average order value use paid, non-cancelled orders only. Total order counts and fulfilment distribution include all orders within the selected period.

### Customers

- Registered customers are identified by `customer_id`; guest customers are grouped by normalized email.
- Customer contact and delivery location come from the most recent order shipping snapshot.
- Lifetime orders, spend, average order value, and last order use valid orders across the store's full history.
- Status precedence is New, VIP, Active, Inactive.
  - New: first valid order occurs in the current month.
  - VIP: lifetime valid spend is at least RM1,000.
  - Active: at least one valid order in the previous 90 days.
  - Inactive: registered account with no valid order in the previous 90 days.
- Guests can be viewed but cannot be edited or deactivated.
- Registered customers can have profile name, phone, and account access updated. Email, password, saved addresses, and historical order snapshots cannot be edited by admins.

### Analytics

- Show revenue, total orders, average order value, revenue trend, sales by category, top products, customer retention, and fulfilment distribution.
- Calculate category and product performance from order item snapshots and `line_total`.
- Revenue trend uses daily buckets for 7/30 Days and aggregated weekly/monthly buckets for longer periods.
- Retention is the percentage of customers in the selected period with more than one valid lifetime order.
- Conversion rate is out of scope because no visit/session analytics source exists.

### Dashboard

- Reuse reporting data for This Month.
- Show revenue, order count, active SKU count, revenue trend, top four products with current product images, and latest four orders.
- Do not display fabricated targets, changes, or performance percentages.
- Empty datasets use informative empty states rather than mock data.

## Architecture

- `adminReporting` owns store-scoped order retrieval and analytics/dashboard calculations.
- `adminCustomers` owns customer aggregation and individual customer detail retrieval.
- Page components receive typed data and only render it.
- Access is always determined from the signed-in user's owner/admin store membership.

## Verification

Tests cover excluded revenue, guest-email aggregation, customer status precedence, category/product rankings, and empty results. Targeted tests and `npm run build` must pass before release.
