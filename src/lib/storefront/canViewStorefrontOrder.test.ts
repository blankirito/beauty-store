import { describe, expect, it } from "vitest";
import { canViewStorefrontOrder } from "./canViewStorefrontOrder";

describe("storefront order access", () => {
  it("allows the customer who owns the order", () => {
    expect(
      canViewStorefrontOrder("customer-user-id", "customer-user-id"),
    ).toBe(true);
  });

  it("blocks a different signed-in customer", () => {
    expect(
      canViewStorefrontOrder("customer-user-id", "other-user-id"),
    ).toBe(false);
  });

  it("blocks guest orders without a customer account", () => {
    expect(canViewStorefrontOrder(null, "customer-user-id")).toBe(false);
  });
});