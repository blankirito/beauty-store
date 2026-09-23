# Customer and merchant registration split

## Outcome

Customers register to shop and land on the storefront home page. People who
want to sell register through a dedicated merchant page, then complete the
existing store application in `/onboarding`.

One account can do both. Merchant intent only controls routing; it never
grants store-management or platform access.

## User journeys

| Person | Entry | After sign-up / sign-in |
| --- | --- | --- |
| Customer | `/register` | `/` |
| New merchant | `/merchant/register` | `/onboarding` |
| Merchant applicant without a store membership | `/login` | `/onboarding` |
| Store owner or admin | `/login` | `/admin` |
| Platform owner | `/login` | `/platform` |

Customers can later choose **Want to sell with Lumina?** and enter the
merchant flow.

## Design

- The existing `/register` page becomes customer-only. It keeps its current
  visual language, writes normal user metadata, and uses `/` as the email
  confirmation destination.
- A new `/merchant/register` page follows the approved Stitch reference. It
  writes `merchant_intent: true` to Supabase Auth user metadata and uses
  `/onboarding` as the email confirmation destination.
- The login form reads the authenticated user's metadata and passes merchant
  intent into `getSignInDestination`.
- `getSignInDestination` keeps strict priority: platform owner, store
  owner/admin, merchant applicant, then customer.
- `/onboarding` permits a merchant applicant or an existing store member and
  redirects an ordinary customer to `/`.
- `/register` links to `/merchant/register`; the merchant page links back to
  `/register`.
- The existing profile menu adds a **Start your store** item using its current
  card style. For an authenticated customer it records merchant intent then
  opens `/onboarding`; without a session it opens `/merchant/register`.
  No homepage redesign or new profile-page visual system is included.

## Errors and safeguards

- Keep existing form validation: required fields, matching passwords, terms,
  Supabase sign-up errors, and email-confirmation instructions.
- The merchant-intent flag is a routing preference only. Authorization remains
  in existing database checks such as platform-admin status and store
  memberships.
- The store application server action also verifies merchant intent or an
  existing store membership before modifying store data.

## Verification

- Add/extend unit tests for all four login destinations.
- Add focused tests for onboarding access rules and registration redirect
  choices where the implementation has a testable pure helper.
- Run `npm test` and `npm run build`.
- Manually verify one new customer account and one new merchant account,
  including sign-out/sign-in before the merchant submits a store application.

## Out of scope

- New billing behavior.
- A homepage visual redesign or a new homepage merchant CTA.
- Changing store roles, application statuses, or platform permissions.
