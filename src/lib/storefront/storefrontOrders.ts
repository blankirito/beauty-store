export type StorefrontFulfillmentStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export function getStorefrontOrderStatus(
  status: StorefrontFulfillmentStatus,
) {
  const labels = {
    new: "Pending",
    processing: "Processing",
    shipped: "Shipping",
    delivered: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status];
}