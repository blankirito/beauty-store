import { describe, expect, it } from "vitest";
import { getAdminOrderMetrics } from "./adminOrderMetrics";

describe("admin order metrics", () => {
  it("counts operational orders and only includes paid orders in revenue", () => {
    const metrics = getAdminOrderMetrics([
      { status: "New", paymentStatus: "Paid", total: 1 },
      { status: "Processing", paymentStatus: "Pending", total: 89 },
      { status: "Shipped", paymentStatus: "Paid", total: 7 },
      { status: "Cancelled", paymentStatus: "Refunded", total: 20 },
    ]);

    expect(metrics).toEqual({
      totalOrderCount: 4,
      actionRequiredCount: 2,
      shippedOrderCount: 1,
      paidRevenue: 8,
    });
  });
});