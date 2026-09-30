import { describe, expect, it } from "vitest";
import {
    extendSubscriptionPeriod,
    getManualPaymentQuote,
    shouldShowDashboardBillingReminder,
    prepareManualPaymentRequest,
} from "./manualSubscriptionPayment";

describe("manual subscription payment", () => {
    const now = new Date("2026-10-03T00:00:00.000Z");

    it("calculates a Standard three-month TNG payment", () => {
        expect(
            getManualPaymentQuote(
                {
                    planCode: "lumina-monthly",
                    foundingPriceLockedUntil: null,
                    months: 3,
                },
                now,
            ),
        ).toEqual({
            monthlyPrice: 59,
            months: 3,
            totalAmount: 177,
        });
    });

    it("uses the founding monthly price while its lock is active", () => {
        expect(
            getManualPaymentQuote(
                {
                    planCode: "lumina-monthly-founding",
                    foundingPriceLockedUntil: "2027-10-03T00:00:00.000Z",
                    months: 12,
                },
                now,
            ),
        ).toEqual({
            monthlyPrice: 29,
            months: 12,
            totalAmount: 348,
        });
    });

    it("rejects a payment duration outside the available options", () => {
        expect(() =>
            getManualPaymentQuote(
                {
                    planCode: "lumina-monthly",
                    foundingPriceLockedUntil: null,
                    months: 2,
                },
                now,
            ),
        ).toThrow("Choose 1, 3, or 12 months.");
    });

    it("extends an early renewal from the current paid period end", () => {
        expect(
            extendSubscriptionPeriod(
                "2026-11-10T00:00:00.000Z",
                1,
                now,
            ),
        ).toBe("2026-12-10T00:00:00.000Z");
    });

    it("starts a new paid period from now when the old period has expired", () => {
        expect(
            extendSubscriptionPeriod(
                "2026-09-10T00:00:00.000Z",
                3,
                now,
            ),
        ).toBe("2027-01-03T00:00:00.000Z");
    });

    it("hides the dashboard billing card during a normal active period", () => {
        expect(
            shouldShowDashboardBillingReminder(
                {
                    status: "active",
                    currentPeriodEndsAt: "2026-10-20T00:00:00.000Z",
                },
                now,
            ),
        ).toBe(false);
    });

    it("shows the dashboard billing card when active access expires within seven days", () => {
        expect(
            shouldShowDashboardBillingReminder(
                {
                    status: "active",
                    currentPeriodEndsAt: "2026-10-10T00:00:00.000Z",
                },
                now,
            ),
        ).toBe(true);
    });

    it("keeps the dashboard billing card visible for trial and payment problems", () => {
        expect(
            shouldShowDashboardBillingReminder(
                {
                    status: "trialing",
                    currentPeriodEndsAt: null,
                },
                now,
            ),
        ).toBe(true);

        expect(
            shouldShowDashboardBillingReminder(
                {
                    status: "past_due",
                    currentPeriodEndsAt: null,
                },
                now,
            ),
        ).toBe(true);

        expect(
            shouldShowDashboardBillingReminder(
                {
                    status: "suspended",
                    currentPeriodEndsAt: null,
                },
                now,
            ),
        ).toBe(true);
    });
    it("normalizes a merchant TNG payment request", () => {
        const formData = new FormData();
        formData.set("months", "3");
        formData.set("payerName", "  Lee Chong Gyu  ");
        formData.set("tngReference", "  TNG-12345  ");
        formData.set("note", "  Three months please  ");

        expect(prepareManualPaymentRequest(formData)).toEqual({
            months: 3,
            payerName: "Lee Chong Gyu",
            tngReference: "TNG-12345",
            note: "Three months please",
        });
    });

    it("rejects an incomplete merchant TNG payment request", () => {
        const formData = new FormData();
        formData.set("months", "1");
        formData.set("payerName", "");
        formData.set("tngReference", "TNG-12345");

        expect(prepareManualPaymentRequest(formData)).toEqual({
            error: "Enter the transfer payer name.",
        });
    });
});