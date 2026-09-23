export function getSignInDestination(
  isPlatformAdmin: boolean,
  hasStoreAdminAccess = false,
  hasMerchantIntent = false,
) {
  if (isPlatformAdmin) {
    return "/platform";
  }

  if (hasStoreAdminAccess) {
    return "/admin";
  }

  if (hasMerchantIntent) {
    return "/onboarding";
  }

  return "/";
}