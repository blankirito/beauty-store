type ShipmentUpdateInput = {
  carrier: string;
  trackingNumber: string;
};

type ShipmentUpdateResult =
  | {
      data: {
        fulfillment_status: "shipped";
        tracking_carrier: string;
        tracking_number: string;
      };
      event: {
        fulfillmentStatus: "shipped";
        title: string;
        note: string;
      };
    }
  | {
      error: string;
    };

export function prepareShipmentUpdate(
  input: ShipmentUpdateInput,
): ShipmentUpdateResult {  const carrier = input.carrier.trim();
  const trackingNumber = input.trackingNumber.trim();

  if (!carrier || !trackingNumber) {
    return {
      error: "Enter both a shipping carrier and tracking number.",
    };
  }

  return {
    data: {
      fulfillment_status: "shipped",
      tracking_carrier: carrier,
      tracking_number: trackingNumber,
    },
    event: {
      fulfillmentStatus: "shipped",
      title: "Order has been shipped",
      note: `${carrier} tracking: ${trackingNumber}`,
    },
  };
}