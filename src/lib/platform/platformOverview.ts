import {
  isPublicStoreEligible,
  type StoreApplicationStatus,
} from "../merchants/storeLifecycle";

type PlatformApplicationSummary = {
  status: StoreApplicationStatus;
  trialEndsAt: string | null;
};

export function getPlatformOverviewMetrics(
  applications: PlatformApplicationSummary[],
  now = new Date(),
) {
  const sevenDaysFromNow = new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000,
  );

  return {
    pendingApplications: applications.filter(
      (application) => application.status === "pending_review",
    ).length,

    activeMerchants: applications.filter((application) =>
      isPublicStoreEligible(
        application.status,
        application.trialEndsAt
          ? new Date(application.trialEndsAt)
          : null,
        now,
      ),
    ).length,

    trialsEndingSoon: applications.filter((application) => {
      if (
        application.status !== "trialing" ||
        application.trialEndsAt === null
      ) {
        return false;
      }

      const trialEndsAt = new Date(application.trialEndsAt);

      return trialEndsAt > now && trialEndsAt <= sevenDaysFromNow;
    }).length,
  };
}