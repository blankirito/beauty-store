import { describe, expect, it } from "vitest";
import { prepareShipmentUpdate } from "./shipmentUpdate";

describe("shipment update preparation", () => {
  it("prepares tracking details when shipping an order", () => {
    expect(
      prepareShipmentUpdate({
        carrier: "DHL",
        trackingNumber: "DHL-123456",
      }),
    ).toEqual({
      data: {
        fulfillment_status: "shipped",
        tracking_carrier: "DHL",
        tracking_number: "DHL-123456",
      },
      event: {
        fulfillmentStatus: "shipped",
        title: "Order has been shipped",
        note: "DHL tracking: DHL-123456",
      },
    });
  });

  it("requires both a carrier and tracking number", () => {
    expect(
      prepareShipmentUpdate({
        carrier: "DHL",
        trackingNumber: "",
      }),
    ).toEqual({
      error: "Enter both a shipping carrier and tracking number.",
    });
  });
});