import {
    getTrialDaysRemaining,
    type StoreApplicationStatus,
} from "./storeLifecycle";

export type MerchantPlanCode =
    | "lumina-monthly"
    | "lumina-monthly-founding"
    | "lumina-monthly-complimentary";

type MerchantBillingInput = {
    applicationStatus: StoreApplicationStatus;
    trialEndsAt: string | null;
    subscriptionStatus: string;
    currentPeriodEndsAt: string | null;
    planCode?: MerchantPlanCode;
    foundingPriceLockedUntil?: string | null;
    trialStartedAt?: string | null;
    paymentGraceEndsAt?: string | null;
};

export function getMerchantBillingStatus(
    input: MerchantBillingInput,
    now = new Date(),
) {
    const isTrialing = input.applicationStatus === "trialing";
    const trialEndsAt = input.trialEndsAt
        ? new Date(input.trialEndsAt)
        : null;

    const planCode = input.planCode ?? "lumina-monthly";
    const foundingPriceLockedUntil = input.foundingPriceLockedUntil ?? null;
    const isComplimentaryPlan =
        planCode === "lumina-monthly-complimentary";

    const hasActiveFoundingPrice =
        planCode === "lumina-monthly-founding" &&
        foundingPriceLockedUntil !== null &&
        new Date(foundingPriceLockedUntil).getTime() > now.getTime();

    return {
        status: isTrialing ? "trialing" : input.subscriptionStatus,
        planCode,
        monthlyPrice: isComplimentaryPlan
    ? 0
    : hasActiveFoundingPrice
        ? 29
        : 59,
        foundingPriceLockedUntil,
        trialStartedAt: input.trialStartedAt ?? null,
        trialEndsAt: input.trialEndsAt,
        trialDaysRemaining:
            isTrialing && trialEndsAt
                ? getTrialDaysRemaining(trialEndsAt, now)
                : null,
        currentPeriodEndsAt: input.currentPeriodEndsAt,
        paymentGraceEndsAt: input.paymentGraceEndsAt ?? null,
    };
}