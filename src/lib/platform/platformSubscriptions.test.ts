import { describe, expect, it } from "vitest";
import { getPlatformSubscriptionMetrics } from "./platformSubscriptions";

describe("platform subscription metrics", () => {
  it("counts subscription plans and merchant billing states", () => {
    expect(
      getPlatformSubscriptionMetrics([
        {
          applicationStatus: "trialing",
          planCode: "lumina-monthly-founding",
          subscriptionStatus: "not_started",
        },
        {
          applicationStatus: "active",
          planCode: "lumina-monthly",
          subscriptionStatus: "active",
        },
        {
          applicationStatus: "active",
          planCode: "lumina-monthly-complimentary",
          subscriptionStatus: "complimentary",
        },
        {
          applicationStatus: "past_due",
          planCode: "lumina-monthly",
          subscriptionStatus: "past_due",
        },
        {
          applicationStatus: "suspended",
          planCode: "lumina-monthly",
          subscriptionStatus: "not_started",
        },
      ]),
    ).toEqual({
      trialing: 1,
      founding: 1,
      standard: 3,
      complimentary: 1,
      pastDue: 1,
      suspended: 1,
    });
  });
});