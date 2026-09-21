export function getAdminAccessDestination(
  isSignedIn: boolean,
  isPlatformAdmin: boolean,
  hasStoreAdminAccess = false,
) {
  if (!isSignedIn) {
    return "/login";
  }

  if (!isPlatformAdmin && !hasStoreAdminAccess) {
    return "/";
  }

  return null;
}