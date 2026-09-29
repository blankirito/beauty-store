# Manual payment QR codes

## Goal

Allow each merchant to add a current QR code to an existing manual payment
method such as Touch 'n Go, DuitNow, or bank transfer. Customers see the QR
code after selecting that payment method during checkout, and again after the
order is placed. The merchant continues to verify incoming funds manually and
uses the existing payment-confirmation workflow.

This feature does not collect customer payment screenshots and does not change
cash-on-delivery behaviour. Stripe will be implemented separately as an
automatic payment workflow.

## Data model

Add an optional `qr_image_path text` field to `public.store_payment_methods`.
A null value means the payment method has text instructions only. One payment
method has at most one current QR code.

QR images are stored in a new public Storage bucket named
`payment-qr-codes`, at paths in this form:

```
stores/{storeId}/payment-methods/{paymentMethodId}/{imageId}.{extension}
```

The bucket accepts JPEG, PNG, and WebP files up to 2 MB. Public read access is
intentional: a QR code must be readable by a customer before checkout. Browser
clients receive no write access to this bucket.

## Merchant experience

The existing Admin > Settings > Payment Methods editor gains an optional
"Payment QR code" area in every payment-method card:

- No QR code: show an upload control.
- Existing QR code: show a small preview and Replace / Remove controls.
- The existing Save changes action persists the label, instructions, enabled
  state, and QR reference together.

The feature is method-agnostic. A merchant may attach a QR to TNG, DuitNow, a
custom transfer method, or bank transfer; normal bank-transfer methods may
remain text-only.

## Upload and authorization

The upload is performed by a server action using the existing server-only
Supabase service client. The action:

1. Verifies the signed-in user is an owner or admin of the selected store.
2. Validates the file MIME type and size before upload.
3. Uploads a new uniquely named object to `payment-qr-codes`.
4. Updates the owned payment-method record with the new path.
5. Attempts to remove the old object only after the database update succeeds.

If validation or upload fails, the current QR path remains unchanged. If
deleting an obsolete object fails, the new QR stays valid; cleanup can be
retried later without breaking checkout.

## Checkout and order flow

When a customer selects a payment method with a QR code, its checkout card
shows the QR image, the merchant's instructions, and this guidance:

> Scan to pay before placing your order. Your order will be confirmed after
> the store verifies payment.

Methods without a QR continue to show instructions only. Disabled methods do
not appear for new checkout sessions.

After a successful order, the success page displays the selected method's QR
and instructions again. The order continues to be created as `pending`; a
merchant must verify the payment externally and use the existing Confirm
payment action before processing the order.

Existing orders preserve their selected payment method label and instructions.
Changing or removing a merchant QR affects future checkout rendering only.

## Stripe coexistence

Manual methods remain pending until merchant confirmation. Stripe will be a
separate, automatic method: it will mark an order paid only after a verified,
idempotent Stripe webhook is received. Neither workflow is allowed to update
the other's order state.

## Failure handling

- Invalid file type, file larger than 2 MB, or upload failure: show a merchant
  error and keep the existing QR.
- Removing a QR: keep the payment method enabled with text-only instructions.
- A QR replacement: publish the new path before attempting old-file cleanup,
  so checkout never loses an already working QR.
- A payment method disabled after an order is placed: existing orders retain
  their method label and instructions; it only blocks new selections.

## Verification

Automated tests cover payment-method mapping and update preparation, upload
validation, authorization boundaries, QR visibility in checkout and success
views, and no regression to existing manual-payment checkout behavior.

Manual test:

1. Upload a QR code as a merchant owner/admin and save the method.
2. Confirm the selected method shows the QR and instructions before checkout.
3. Place an order and confirm the success page repeats the payment details.
4. Confirm the order remains pending until the merchant marks it paid.
5. Replace and remove the QR, checking checkout updates correctly each time.
