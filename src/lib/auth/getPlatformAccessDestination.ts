export function getPlatformAccessDestination(
  isSignedIn: boolean,
  isPlatformAdmin: boolean,
) {
  if (!isSignedIn) {
    return "/login";
  }

  if (!isPlatformAdmin) {
    return "/admin";
  }

  return null;
}