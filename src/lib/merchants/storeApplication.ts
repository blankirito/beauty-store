export type StoreApplicationInput = {
  name: string;
  slug: string;
  category: string;
  contactName: string;
  phone: string;
  description: string;
};

const RESERVED_SLUGS = new Set([
  "admin",
  "platform",
  "login",
  "register",
  "onboarding",
  "store",
]);

export function normalizeStoreSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateStoreApplicationInput(
  input: StoreApplicationInput,
) {
  const fieldErrors: Record<string, string> = {};

  if (!input.name.trim()) {
    fieldErrors.name = "Store name is required.";
  }

  const normalizedSlug = normalizeStoreSlug(input.slug);

  if (!normalizedSlug) {
    fieldErrors.slug = "Store URL is required.";
  } else if (RESERVED_SLUGS.has(normalizedSlug)) {
    fieldErrors.slug = "This store URL is reserved.";
  }

  if (!input.category.trim()) {
    fieldErrors.category = "Store category is required.";
  }

  if (!input.contactName.trim()) {
    fieldErrors.contactName = "Contact name is required.";
  }

  if (!input.phone.trim()) {
    fieldErrors.phone = "Phone number is required.";
  }

  if (!input.description.trim()) {
    fieldErrors.description = "Store description is required.";
  } else if (input.description.length > 240) {
    fieldErrors.description =
      "Store description must be 240 characters or fewer.";
  }

  return { fieldErrors };
}