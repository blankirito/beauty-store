import { describe, expect, it } from "vitest";
import { getMerchantBillingStatus } from "./merchantBilling";

describe("merchant billing status", () => {
    it("shows the remaining days and RM59 price during a free trial", () => {
        expect(
            getMerchantBillingStatus(
                {
                    applicationStatus: "trialing",
                    trialEndsAt: "2026-10-10T00:00:00.000Z",
                    subscriptionStatus: "not_started",
                    currentPeriodEndsAt: null,
                },
                new Date("2026-10-03T00:00:00.000Z"),
            ),
        ).toEqual({
            status: "trialing",
            planCode: "lumina-monthly",
            monthlyPrice: 59,
            foundingPriceLockedUntil: null,
            trialStartedAt: null,
            trialEndsAt: "2026-10-10T00:00:00.000Z",
            trialDaysRemaining: 7,
            currentPeriodEndsAt: null,
            paymentGraceEndsAt: null,
        });
    });

    it("uses the RM29 founding price while the founding lock is active", () => {
        expect(
            getMerchantBillingStatus(
                {
                    applicationStatus: "trialing",
                    trialEndsAt: "2026-10-10T00:00:00.000Z",
                    subscriptionStatus: "not_started",
                    currentPeriodEndsAt: null,
                    planCode: "lumina-monthly-founding",
                    foundingPriceLockedUntil: "2027-10-03T00:00:00.000Z",
                },
                new Date("2026-10-03T00:00:00.000Z"),
            ),
        ).toMatchObject({
            planCode: "lumina-monthly-founding",
            monthlyPrice: 29,
            foundingPriceLockedUntil: "2027-10-03T00:00:00.000Z",
        });
    });

    it("uses the RM59 standard price when no founding plan is assigned", () => {
        expect(
            getMerchantBillingStatus(
                {
                    applicationStatus: "trialing",
                    trialEndsAt: "2026-10-10T00:00:00.000Z",
                    subscriptionStatus: "not_started",
                    currentPeriodEndsAt: null,
                    planCode: "lumina-monthly",
                    foundingPriceLockedUntil: null,
                },
                new Date("2026-10-03T00:00:00.000Z"),
            ),
        ).toMatchObject({
            planCode: "lumina-monthly",
            monthlyPrice: 59,
            foundingPriceLockedUntil: null,
        });
    });

    it("returns to RM59 after the founding price lock expires", () => {
        expect(
            getMerchantBillingStatus(
                {
                    applicationStatus: "active",
                    trialEndsAt: null,
                    subscriptionStatus: "active",
                    currentPeriodEndsAt: "2027-10-10T00:00:00.000Z",
                    planCode: "lumina-monthly-founding",
                    foundingPriceLockedUntil: "2027-10-03T00:00:00.000Z",
                },
                new Date("2027-10-04T00:00:00.000Z"),
            ),
        ).toMatchObject({
            planCode: "lumina-monthly-founding",
            monthlyPrice: 59,
            foundingPriceLockedUntil: "2027-10-03T00:00:00.000Z",
        });
    });

    it("keeps trial dates available for the Billing UI", () => {
        expect(
            getMerchantBillingStatus(
                {
                    applicationStatus: "trialing",
                    trialStartedAt: "2026-09-26T00:00:00.000Z",
                    trialEndsAt: "2026-10-10T00:00:00.000Z",
                    subscriptionStatus: "not_started",
                    currentPeriodEndsAt: null,
                    planCode: "lumina-monthly",
                    foundingPriceLockedUntil: null,
                },
                new Date("2026-10-03T00:00:00.000Z"),
            ),
        ).toMatchObject({
            trialStartedAt: "2026-09-26T00:00:00.000Z",
            trialEndsAt: "2026-10-10T00:00:00.000Z",
            trialDaysRemaining: 7,
        });
    });

    it("shows RM0 for a complimentary merchant", () => {
        expect(
            getMerchantBillingStatus({
                applicationStatus: "active",
                trialEndsAt: null,
                subscriptionStatus: "complimentary",
                currentPeriodEndsAt: null,
                planCode: "lumina-monthly-complimentary",
            }),
        ).toMatchObject({
            status: "complimentary",
            planCode: "lumina-monthly-complimentary",
            monthlyPrice: 0,
        });
    });

    it("keeps the payment grace deadline available after complimentary access is removed", () => {
        expect(
            getMerchantBillingStatus({
                applicationStatus: "past_due",
                trialEndsAt: null,
                subscriptionStatus: "past_due",
                currentPeriodEndsAt: null,
                planCode: "lumina-monthly",
                paymentGraceEndsAt: "2026-10-05T00:00:00.000Z",
            }),
        ).toMatchObject({
            status: "past_due",
            monthlyPrice: 59,
            paymentGraceEndsAt: "2026-10-05T00:00:00.000Z",
        });
    });
    it("shows a suspended application as paused even when it previously had complimentary access", () => {
        expect(
            getMerchantBillingStatus({
                applicationStatus: "suspended",
                trialEndsAt: null,
                subscriptionStatus: "complimentary",
                currentPeriodEndsAt: null,
                planCode: "lumina-monthly-complimentary",
            }),
        ).toMatchObject({
            status: "suspended",
            monthlyPrice: 0,
        });
    });
});