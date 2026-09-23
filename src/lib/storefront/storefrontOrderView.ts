import {
  getStorefrontOrderStatus,
  type StorefrontFulfillmentStatus,
} from "./storefrontOrders";

export type StorefrontOrderViewItem = {
  name: string;
  quantity: number;
  imagePath: string | null;
};

export type StorefrontOrderViewInput = {
  orderNumber: string;
  fulfillmentStatus: StorefrontFulfillmentStatus;
  createdAt: string;
  total: number;
  items: StorefrontOrderViewItem[];
};

export function getShippingAddress<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

export function toStorefrontOrderView(order: StorefrontOrderViewInput) {
  const firstItem = order.items[0] ?? null;
  const additionalItemCount = Math.max(order.items.length - 1, 0);
  const firstItemQuantity = firstItem?.quantity ?? 0;

  return {
    ...order,
    status: getStorefrontOrderStatus(order.fulfillmentStatus),
    canTrack: order.fulfillmentStatus === "shipped",
    firstItem,
    itemSummary: firstItem
      ? `${firstItemQuantity} item${firstItemQuantity === 1 ? "" : "s"}${
          additionalItemCount > 0 ? ` · +${additionalItemCount} more` : ""
        }`
      : "No items",
  };
}
