import { describe, expect, it } from "vitest";
import {
  getComplimentaryAccessChange,
} from "./complimentaryAccess";

describe("complimentary access", () => {
  it("activates complimentary access without a payment deadline", () => {
    expect(
      getComplimentaryAccessChange("grant", new Date("2026-09-28T00:00:00.000Z")),
    ).toEqual({
      planCode: "lumina-monthly-complimentary",
      subscriptionStatus: "complimentary",
      paymentGraceEndsAt: null,
    });
  });

  it("returns a merchant to RM59 with a seven-day payment grace period", () => {
    expect(
      getComplimentaryAccessChange("remove", new Date("2026-09-28T00:00:00.000Z")),
    ).toEqual({
      planCode: "lumina-monthly",
      subscriptionStatus: "past_due",
      paymentGraceEndsAt: "2026-10-05T00:00:00.000Z",
    });
  });
});