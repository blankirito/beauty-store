import type { OrderStatus, PaymentStatus } from "./adminOrder";

type OrderForMetrics = {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
};

export function getAdminOrderMetrics(orders: OrderForMetrics[]) {
  return {
    totalOrderCount: orders.length,
    actionRequiredCount: orders.filter(
      (order) =>
        order.status === "New" || order.status === "Processing",
    ).length,
    shippedOrderCount: orders.filter(
      (order) => order.status === "Shipped",
    ).length,
    paidRevenue: orders
      .filter((order) => order.paymentStatus === "Paid")
      .reduce((total, order) => total + order.total, 0),
  };
}