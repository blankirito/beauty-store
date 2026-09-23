import type { StoreApplicationStatus } from "./storeLifecycle";

export function getStoreApplicationMutation(
  applicationStatus: StoreApplicationStatus | null,
) {
  if (applicationStatus === null) {
    return { type: "create" as const };
  }

  if (
    applicationStatus === "draft" ||
    applicationStatus === "rejected"
  ) {
    return { type: "update" as const };
  }

  return {
    type: "error" as const,
    message: "This store application can no longer be edited.",
  };
}