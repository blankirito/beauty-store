export function getSignInDestination(
  isPlatformAdmin: boolean,
  hasStoreAdminAccess = false,
) {
  return isPlatformAdmin || hasStoreAdminAccess ? "/admin" : "/";
}