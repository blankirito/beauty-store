import type { StoreApplicationStatus } from "@/lib/merchants/storeLifecycle";

type PlatformSubscriptionRecord = {
  applicationStatus: StoreApplicationStatus;
  planCode: string;
  subscriptionStatus: string;
};

export function getPlatformSubscriptionMetrics(
  records: PlatformSubscriptionRecord[],
) {
  return {
    trialing: records.filter(
      (record) => record.applicationStatus === "trialing",
    ).length,

    founding: records.filter(
      (record) => record.planCode === "lumina-monthly-founding",
    ).length,

    standard: records.filter(
      (record) => record.planCode === "lumina-monthly",
    ).length,

    complimentary: records.filter(
      (record) => record.planCode === "lumina-monthly-complimentary",
    ).length,

    pastDue: records.filter(
      (record) =>
        record.applicationStatus === "past_due" ||
        record.subscriptionStatus === "past_due",
    ).length,

    suspended: records.filter(
      (record) => record.applicationStatus === "suspended",
    ).length,
  };
}