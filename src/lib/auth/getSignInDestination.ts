export function getSignInDestination(
  isPlatformAdmin: boolean,
  hasStoreAdminAccess = false,
) {
  if (isPlatformAdmin) {
    return "/platform";
  }

  if (hasStoreAdminAccess) {
    return "/admin";
  }

  return "/";
}