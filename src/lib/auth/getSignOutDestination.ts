export function getSignOutDestination(storeSlug?: string) {
  const normalizedSlug = storeSlug?.trim().toLowerCase();

  return normalizedSlug ? `/store/${normalizedSlug}` : "/login";
}