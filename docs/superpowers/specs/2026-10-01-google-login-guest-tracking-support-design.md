# Google Login and Guest Tracking Support Design

## Purpose

Make it easier for customers to sign in and safely retain access to guest
orders without adding an unreliable customer-email service before Lumina has a
verified sending domain.

This release adds Google sign-in, a clear save/copy action for private guest
order tracking links, and a WhatsApp support route for password-recovery
requests. It also provides an internal guide for the Platform Admin who
handles those support requests.

## Confirmed Scope

- Customers can choose **Continue with Google** from the existing Login page.
- Google authentication uses the existing Supabase Auth project and user
  records; no second identity provider, account table, or role model is added.
- The existing store-aware post-sign-in routing remains authoritative for
  customer, merchant Admin, and Platform users.
- Guest checkout success continues to provide a private tracking URL and adds
  a copy action plus a clear reminder to save it.
- **Forgot Password?** becomes a WhatsApp support link with a prefilled,
  non-sensitive help message.
- The public WhatsApp support number is supplied only through
  `NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER`; it is not hard-coded, tested, or
  documented with its real value.
- A private operator guide describes the allowed support process and password
  safety rules.

## Google Login

The existing `SocialLogin` component starts a Supabase `signInWithOAuth`
request for the Google provider. It includes a callback URL under the current
application origin and an optional safe relative `next` destination.

`/auth/callback` is a server route that accepts only a Supabase OAuth code and
a safe application-relative destination. It exchanges the code using the
request-bound Supabase server client, which persists the session in cookies.
It then reads the user profile and store membership using the same access
logic as the existing password login, and redirects through
`getSignInDestination`.

When a customer starts from a store-specific login page, the callback retains
that store slug so they return to the appropriate store. Untrusted absolute
or malformed `next` values fall back to the normal safe destination.

The user must configure Google in Google Cloud and Supabase before the button
is considered active:

1. Supabase URL Configuration uses the production Vercel root URL as Site URL
   and allows the callback URL.
2. Google Cloud uses the production Vercel root URL as an authorized JavaScript
   origin and the Supabase Dashboard-provided callback URL as its authorized
   redirect URI.
3. The Google provider is enabled in Supabase with the Google client ID and
   secret.

No Google credentials are stored in the repository or Vercel public variables.

## Guest Order Tracking

Every guest checkout already receives a cryptographically strong private token
and a URL containing the order number and token. The existing protected
tracking route remains the only guest-order read path.

The checkout success view adds a **Copy tracking link** action. On success it
confirms that the link was copied and explains that it grants access to the
order, so the customer should save it and not share it. The existing **Track
this order** action remains.

No generic "find my order" form is introduced. Order number plus email alone
is not sufficient proof of ownership, and Lumina does not yet have production
email delivery to securely reissue tracking links. A guest who loses the link
uses WhatsApp support, where the operator follows the internal guide.

## Password-Recovery Support

Lumina does not expose a customer-facing password-reset email flow in this
release. The default Supabase email service is limited to authorized project
team addresses and is not suitable for customer production use.

The Login form changes **Forgot Password?** into an accessible WhatsApp link.
It opens a message addressed to the support number from
`NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER` and pre-fills a generic request for
sign-in assistance. The text must not include the visitor's password, order
details, token, or email address.

If the support number environment variable is absent or malformed, the UI
shows a safe support-unavailable notice rather than producing a broken link.

## Platform Admin Support Guide

Create an operator-only markdown guide outside the public app interface. It
instructs the Platform Admin to:

1. Ask only for the customer's account email and, for an order question, the
   order number.
2. Confirm whether an account or order exists through the protected Supabase
   Dashboard; do not disclose another user's details.
3. Explain that passwords cannot be viewed, requested, received, or manually
   set through WhatsApp.
4. Suggest Google sign-in when it is linked to the same email, or advise the
   customer to wait for a future verified-email reset process.
5. Treat guest tracking tokens as private credentials; never request them and
   never post them into support chat.
6. Escalate payment, fraud, or identity disputes without modifying customer
   accounts or order ownership.

The guide does not grant Platform Admin additional database capabilities and
does not change Row Level Security.

## Error Handling and Safety

- OAuth errors redirect to Login with a generic safe message; client ID,
  secret, provider error details, and code values are never rendered.
- The callback accepts only relative `next` values beginning with `/` and
  rejects protocol-relative paths such as `//example.com`.
- A Google-authenticated user is routed with existing role checks, not based
  on client-provided role metadata.
- Copying a tracking link is client-only; the token is never logged or sent to
  a new endpoint.
- The WhatsApp link never embeds customer input or secrets.
- Missing support configuration degrades safely and does not prevent password
  login.

## Testing and Launch Verification

Add focused tests for callback destination safety, Google sign-in URL input,
support-link normalization, and guest tracking-link copy feedback behaviour.

Before launch:

1. Run focused tests, the full Vitest suite, and the production build.
2. Configure the production Site URL, allowed callback URL, Google Cloud
   origin, Google redirect URI, and Supabase Google provider credentials.
3. Sign in with a new Google account from both generic Login and a
   store-specific Login URL; confirm the expected post-login destination.
4. Complete a guest checkout, copy the tracking link, paste it into a private
   browser, and confirm it opens only that order.
5. Confirm Forgot Password opens WhatsApp with only the generic prefilled
   message and no customer data.
6. Temporarily omit the support-number variable in a local or preview setup
   and confirm the UI gives a safe unavailable state.

## Out of Scope

- Customer-facing password-reset emails, custom SMTP, Resend, order
  confirmation emails, or email-based guest-link recovery.
- A custom domain, branded sending email address, or Google brand
  verification.
- Password viewing, support-set passwords, temporary passwords, or account
  ownership changes by Platform Admin.
- A generic guest order lookup based only on order number, name, phone, or
  email.
- Linking or merging an existing password account with a distinct Google
  identity when the email addresses differ.
