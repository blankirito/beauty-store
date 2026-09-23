type StorefrontProfileOrder = {
  fulfillmentStatus: string;
};

export function getStorefrontProfileName(
  fullName: string | null,
  email: string,
) {
  const normalizedName = fullName?.trim();

  return normalizedName || email;
}

export function getStorefrontProfileMetrics(
  orders: StorefrontProfileOrder[],
) {
  const activeStatuses = new Set(["new", "processing", "shipped"]);

  return {
    orderCount: orders.length,
    activeOrderCount: orders.filter((order) =>
      activeStatuses.has(order.fulfillmentStatus),
    ).length,
  };
}