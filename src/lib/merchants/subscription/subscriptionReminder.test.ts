import { describe, expect, it } from "vitest";
import { getSubscriptionReminder } from "./subscriptionReminder";

describe("subscription reminder", () => {
  it("shows a trial reminder with the remaining days", () => {
    expect(
      getSubscriptionReminder({
        status: "trialing",
        trialDaysRemaining: 7,
        trialEndsAt: "2026-10-10T00:00:00.000Z",
        currentPeriodEndsAt: null,
      }),
    ).toMatchObject({
      title: "7 days left in your free trial",
      actionLabel: "View billing",
      tone: "trial",
    });
  });

  it("shows recovery guidance when payment needs attention", () => {
    expect(
      getSubscriptionReminder({
        status: "past_due",
        trialDaysRemaining: null,
        trialEndsAt: null,
        currentPeriodEndsAt: null,
      }),
    ).toMatchObject({
      title: "Payment needs attention",
      actionLabel: "View billing",
      tone: "warning",
    });
  });
});