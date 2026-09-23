import { describe, expect, it } from "vitest";
import {
    canReviewApplication,
    getTrialDaysRemaining,
    isPublicStoreEligible,
    canEditStoreApplication,
} from "./storeLifecycle";

describe("store lifecycle", () => {
    it("allows an unexpired trial store to be public", () => {
        expect(
            isPublicStoreEligible(
                "trialing",
                new Date("2026-09-24T00:00:00Z"),
                new Date("2026-09-23T00:00:00Z"),
            ),
        ).toBe(true);
    });

    it("does not allow an expired trial store to be public", () => {
        expect(
            isPublicStoreEligible(
                "trialing",
                new Date("2026-09-22T00:00:00Z"),
                new Date("2026-09-23T00:00:00Z"),
            ),
        ).toBe(false);
    });

    it("allows a platform admin to approve a pending application", () => {
        expect(canReviewApplication("pending_review", "approve")).toBe(true);
    });

    it("only allows suspension after a store has been approved", () => {
        expect(canReviewApplication("pending_review", "suspend")).toBe(false);
        expect(canReviewApplication("active", "suspend")).toBe(true);
    });

    it("calculates whole trial days remaining", () => {
        expect(
            getTrialDaysRemaining(
                new Date("2026-09-24T00:00:00Z"),
                new Date("2026-09-23T12:00:00Z"),
            ),
        ).toBe(1);
    });

    it("only allows draft or rejected applications to be edited", () => {
        expect(canEditStoreApplication("draft")).toBe(true);
        expect(canEditStoreApplication("rejected")).toBe(true);

        expect(canEditStoreApplication("pending_review")).toBe(false);
        expect(canEditStoreApplication("trialing")).toBe(false);
        expect(canEditStoreApplication("active")).toBe(false);
        expect(canEditStoreApplication("suspended")).toBe(false);
    });
    it("allows a platform admin to request changes to a pending application", () => {
        expect(canReviewApplication("pending_review", "reject")).toBe(true);
        expect(canReviewApplication("active", "reject")).toBe(false);
    });
});