export type StoreApplicationStatus =
  | "draft"
  | "pending_review"
  | "trialing"
  | "active"
  | "past_due"
  | "suspended"
  | "rejected";

export type StoreReviewAction = "approve" | "reject" | "suspend";

export function isPublicStoreEligible(
  status: StoreApplicationStatus,
  trialEndsAt: Date | null,
  now = new Date(),
) {
  return (
    status === "active" ||
    (status === "trialing" &&
      trialEndsAt !== null &&
      trialEndsAt.getTime() > now.getTime())
  );
}

export function canReviewApplication(
  status: StoreApplicationStatus,
  action: StoreReviewAction,
) {
  if (action === "approve" || action === "reject") {
    return status === "pending_review";
  }

  return ["trialing", "active", "past_due"].includes(status);
}

export function getTrialDaysRemaining(
  trialEndsAt: Date,
  now = new Date(),
) {
  const millisecondsRemaining =
    trialEndsAt.getTime() - now.getTime();

  return Math.max(
    0,
    Math.ceil(millisecondsRemaining / (1000 * 60 * 60 * 24)),
  );
}

export function canEditStoreApplication(
  status: StoreApplicationStatus,
) {
  return status === "draft" || status === "rejected";
}