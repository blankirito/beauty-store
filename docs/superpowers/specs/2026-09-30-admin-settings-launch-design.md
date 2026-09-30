# Admin Settings Launch Design

## Purpose

Make the merchant Admin Settings area suitable for launch: merchants can
maintain the public identity of their store, see and manage their order
notifications, and understand which future settings are not yet available.
The scope deliberately avoids building team management or delivery features
before they are ready.

## Confirmed Scope

The Admin Settings menu contains exactly five items:

1. **Store Profile** — available.
2. **Payment Methods** — available; its existing workflow is unchanged.
3. **Team & Permissions** — visible, labelled “Coming soon”, and not
   interactive.
4. **Delivery & Shipping** — visible, labelled “Coming soon”, and not
   interactive.
5. **Notifications** — available.

No settings item is removed in this release. In particular, Delivery &
Shipping remains visible as a future capability rather than implying that the
product will never support delivery configuration.

## Store Profile

`/admin/settings/profile` is a protected merchant-admin page. It loads the
current administrator's selected store and presents one save form containing:

- **Store name** — required public-facing name.
- **Store URL** — editable slug, shown with the store URL prefix.
- **Store description** — optional public-facing introduction.

Only a store owner or store admin may update the profile. The existing store
must be selected through the same store-membership logic used by Payment
Methods. A security-definer database RPC verifies that role and updates only
the store name, slug, and description; it does not permit a profile editor to
change the store owner or any other store field.

The slug accepts lowercase letters, numbers, and hyphens; it cannot begin or
end with a hyphen, be empty, or collide with another store. The update action
normalizes it to lowercase, validates the length and format, and returns a
clear field-safe error without changing any data on failure.

After a successful slug update, storefront routes use the new URL immediately.
The application does not redirect the old URL in this release. The page
therefore clearly tells the administrator that old shared links will stop
working and shows the new URL after saving.

## Notifications

`/admin/settings/notifications` is a protected page for the signed-in
merchant administrator. It reuses `store_notifications`; no new notification
table, notification preference table, or delivery channel is introduced.

The page reads notifications addressed to the signed-in administrator only,
with all unread notifications first (newest first), followed by read
notifications (newest first). Each item shows title, description, time, and
its order number when available.

Selecting an unread item marks it read and then opens its matching admin
order when it has one. Selecting an item with no linked order only marks it
read. The existing header bell remains a compact recent-notifications view;
the new page is the complete history and uses the same marking action and
authorization rule.

The empty state explains that order activity will appear here. A notification
never becomes visible to another user merely because they share the same
store.

## Interface and Navigation

The existing mobile-first Lumina Admin visual language is retained. Store
Profile and Notifications are direct menu links with the standard available
style. Team & Permissions and Delivery & Shipping are muted cards with a
clock icon and “Coming soon”; they have no misleading links or disabled form
controls.

Every new page includes a return link to Admin Settings, a clear title, a
short explanation, responsive spacing, and accessible labels and status text.

## Error Handling and Data Safety

- Unauthenticated users receive the existing sign-in/authorization behaviour.
- Missing store membership or a failed store lookup produces a safe error;
the action never updates an arbitrary store.
- A duplicate slug reports that the URL is already in use. Database constraint
errors are mapped to a readable message.
- Invalid, oversized, or empty required profile values are rejected on the
server as well as constrained in the form.
- Marking a notification read remains scoped to the authenticated recipient.
- A notification read update succeeding before a navigation failure is safe:
the item remains read and can be opened again.

## Testing and Launch Verification

Add focused unit tests for profile normalization and validation, including
valid slugs, invalid characters, edge hyphens, required name, and value
lengths. Add focused tests for notification grouping: unread first, then read,
both newest-first, without mixing recipients.

Before launch, run the focused tests, the full test suite, and the production
build. Manually verify that an owner/admin can save each Store Profile field,
the changed slug opens the store at its new URL, an invalid or duplicated slug
is rejected, the settings menu has exactly the agreed five cards, unread
notifications appear above read notifications, and opening an unread order
notification marks it read and navigates correctly.

## Out of Scope

- Inviting, removing, or changing team members and permissions.
- Delivery zones, delivery fees, shipping carriers, or fulfilment rules.
- Notification email, push notifications, preference toggles, delete, bulk
  read, pagination controls, or a separate notification database model.
- Old-slug redirects or URL history.
