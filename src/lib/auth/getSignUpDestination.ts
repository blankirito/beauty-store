export function getSignUpDestination(
  isMerchantRegistration: boolean,
  storeSlug?: string,
) {
  if (isMerchantRegistration) {
    return "/onboarding";
  }

  const normalizedSlug = storeSlug?.trim().toLowerCase();

  return normalizedSlug ? `/store/${normalizedSlug}` : "/";
}