import { describe, expect, it } from "vitest";
import {
  getShippingAddress,
  toStorefrontOrderView,
} from "./storefrontOrderView";

describe("storefront order view", () => {
  it("maps a delivered order to the original completed label", () => {
    expect(
      toStorefrontOrderView({
        orderNumber: "ORD-001009",
        fulfillmentStatus: "delivered",
        createdAt: "2026-09-23T00:00:00.000Z",
        total: 7,
        items: [{ name: "Serum", quantity: 1, imagePath: null }],
      }),
    ).toMatchObject({
      status: "Completed",
      canTrack: false,
    });
  });

  it("summarizes the first item and remaining line items", () => {
    expect(
      toStorefrontOrderView({
        orderNumber: "ORD-001009",
        fulfillmentStatus: "new",
        createdAt: "2026-09-23T00:00:00.000Z",
        total: 7,
        items: [
          { name: "Serum", quantity: 1, imagePath: null },
          { name: "Cleanser", quantity: 2, imagePath: null },
          { name: "Mask", quantity: 1, imagePath: null },
        ],
      }).itemSummary,
    ).toBe("1 item · +2 more");
  });

  it("normalizes either form of a shipping-address relation", () => {
    const address = { recipient_name: "Ava" };

    expect(getShippingAddress(address)).toEqual(address);
    expect(getShippingAddress([address])).toEqual(address);
  });
});
