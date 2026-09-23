# Storefront UI Restoration Design

## Goal

Make every customer-facing store route under `/store/[slug]` use the existing Lumina UI rather than a second, simplified storefront design, while preserving store-scoped data and navigation.

## Scope

The routes are the storefront home, product detail, search, profile, cart, order history, order detail, and tracking. The global pages remain unchanged.

## Visual source of truth

Existing components and their current Tailwind classes are the source of truth for colour, typography, spacing, cards, status badges, navigation, and actions:

- Home: `Navbar`, home search and product components.
- Product: `ProductNavbar`, `ProductGallery`, `ProductInfo`, `QuantitySelector`, `ProductDescription`, `ReviewSection`, and `BottomActionBar`.
- Search: `Navbar2`, `SearchBar`, `RecentSearch`, `PopularCategory`, and `SearchProductGrid`.
- Profile: `Navbar`, `ProfileHeader`, `ProfileStats`, `ProfileMenu`, and `LogoutButton`.
- Cart: `Navbar2`, `CartHeader`, `CartList`, `OrderSummary`, `PromoCode`, and `CheckoutBar`.
- Orders: `Navbar2`, `OrdersHeader`, `OrderTabs`, `OrderCard`, order-detail components, and tracking components.

No new hard-coded colour palette, replacement visual system, or new page shell will be introduced for storefront routes.

## Architecture

Storefront-specific adapters will translate real store products, cart contents, and customer orders into props matching the existing presentation components. Where an existing component is coupled to global mock data or global links, a storefront variant will retain its markup and classes but accept serializable real data and build `/store/[slug]` URLs.

`StorefrontHeader` will no longer be the visual shell for these routes. Store-aware navigation links will be threaded into versions of the original navigation patterns instead.

## Data and access

- Every product query remains restricted by `store_id` and public-store eligibility.
- Every order query remains restricted by `store_id` and the authenticated customer ID.
- Guest order tracking continues to require its token; signed-in customer detail access continues to require their matching `customer_id`.
- Store cart state stays segregated by store slug.
- The customer order loader normalizes the shipping-address relation safely because the runtime response can be a single object while generated TypeScript inference represents it as an array.

## Order UI and state mapping

Database statuses map to existing customer labels: `new` to Pending, `processing` to Processing, `shipped` to Shipping, `delivered` to Completed, and `cancelled` to Cancelled. The store order list uses the original tabs/cards. Shipping orders expose Track Order; all orders expose View Details. Detail and tracking pages reuse the original timeline, item, order-summary, shipping-address, and payment-method layouts with live order snapshots.

## Error and empty states

Unauthenticated profile or orders routes keep the customer within the store by linking to `/login?store=<slug>`. Empty search, cart, and order states reuse the project’s existing wording and card styling. Missing or unauthorized store/order records return `notFound()` without exposing order data.

## Verification

Unit tests cover adapters and status/link mappings. Existing storefront navigation, search, cart, order access, and authentication-destination tests remain green. Build must pass. Manual verification covers the complete signed-in storefront flow: browse, search, product detail, cart, checkout, order list, detail, tracking, profile, sign out, and return to the same store.
