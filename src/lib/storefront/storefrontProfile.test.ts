import { describe, expect, it } from "vitest";
import {
  getStorefrontProfileMetrics,
  getStorefrontProfileName,
} from "./storefrontProfile";

describe("storefront profile", () => {
  it("uses the member name and falls back to email", () => {
    expect(
      getStorefrontProfileName("  Claire Delacroix  ", "claire@example.com"),
    ).toBe("Claire Delacroix");

    expect(getStorefrontProfileName(null, "claire@example.com")).toBe(
      "claire@example.com",
    );
  });

  it("counts only active fulfillment orders as active", () => {
    expect(
      getStorefrontProfileMetrics([
        { fulfillmentStatus: "new" },
        { fulfillmentStatus: "processing" },
        { fulfillmentStatus: "shipped" },
        { fulfillmentStatus: "delivered" },
        { fulfillmentStatus: "cancelled" },
      ]),
    ).toEqual({
      orderCount: 5,
      activeOrderCount: 3,
    });
  });
});