import { describe, expect, it } from "vitest";
import { getPlatformOverviewMetrics } from "./platformOverview";

describe("platform overview", () => {
  it("summarizes pending applications and merchant lifecycle health", () => {
    const now = new Date("2026-09-23T00:00:00Z");

    expect(
      getPlatformOverviewMetrics(
        [
          { status: "pending_review", trialEndsAt: null },
          { status: "pending_review", trialEndsAt: null },
          { status: "trialing", trialEndsAt: "2026-09-26T00:00:00Z" },
          { status: "active", trialEndsAt: null },
          { status: "trialing", trialEndsAt: "2026-09-20T00:00:00Z" },
          { status: "rejected", trialEndsAt: null },
        ],
        now,
      ),
    ).toEqual({
      pendingApplications: 2,
      activeMerchants: 2,
      trialsEndingSoon: 1,
    });
  });
});