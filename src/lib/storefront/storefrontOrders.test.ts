import { describe, expect, it } from "vitest";
import { getStorefrontOrderStatus } from "./storefrontOrders";

describe("storefront orders", () => {
  it("maps database fulfillment statuses to shopper-facing labels", () => {
    expect(getStorefrontOrderStatus("new")).toBe("Pending");
    expect(getStorefrontOrderStatus("processing")).toBe("Processing");
    expect(getStorefrontOrderStatus("shipped")).toBe("Shipping");
    expect(getStorefrontOrderStatus("delivered")).toBe("Completed");
    expect(getStorefrontOrderStatus("cancelled")).toBe("Cancelled");
  });
});