import type { StoreApplicationStatus } from "../merchants/storeLifecycle";

type MerchantDestinationInput = {
  isPlatformAdmin: boolean;
  applicationStatus: StoreApplicationStatus | null;
};

export function getMerchantDestination({
  isPlatformAdmin,
  applicationStatus,
}: MerchantDestinationInput) {
  if (isPlatformAdmin) {
    return "/platform";
  }

  if (applicationStatus === null) {
    return "/onboarding";
  }

  return "/admin";
}