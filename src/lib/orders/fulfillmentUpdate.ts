export type FulfillmentStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type FulfillmentUpdateInput = {
  currentStatus: FulfillmentStatus;
  nextStatus: FulfillmentStatus;
};

const allowedNextStatuses: Record<
  FulfillmentStatus,
  FulfillmentStatus[]
> = {
  new: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const eventTitles: Record<FulfillmentStatus, string> = {
  new: "Order placed",
  processing: "Order is being processed",
  shipped: "Order has been shipped",
  delivered: "Order has been delivered",
  cancelled: "Order has been cancelled",
};

export function prepareFulfillmentUpdate(
  input: FulfillmentUpdateInput,
) {
  const isAllowed = allowedNextStatuses[input.currentStatus].includes(
    input.nextStatus,
  );

  if (!isAllowed) {
    return {
      error: "This order can no longer be moved to that status.",
    };
  }

  return {
    data: {
      fulfillment_status: input.nextStatus,
    },
    event: {
      fulfillmentStatus: input.nextStatus,
      title: eventTitles[input.nextStatus],
    },
  };
}