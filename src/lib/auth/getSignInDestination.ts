export function getSignInDestination(
  isPlatformAdmin: boolean,
  hasStoreMembership: boolean,
  hasMerchantIntent: boolean,
  storeSlug?: string,
) {
  if (isPlatformAdmin) {
    return "/platform";
  }

  if (hasStoreMembership) {
    return "/admin";
  }

  if (hasMerchantIntent) {
    return "/onboarding";
  }

  const normalizedSlug = storeSlug?.trim().toLowerCase();

  return normalizedSlug ? `/store/${normalizedSlug}` : "/";
}