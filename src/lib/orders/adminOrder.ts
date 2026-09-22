export type OrderStatus =
  | "New"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Refunded"
  | "Failed";

type DatabaseOrder = {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  payment_status: string;
  fulfillment_status: string;
  payment_method: string | null;
  total: number;
  created_at: string;
  order_items?: { id: string }[] | null;
};

export type AdminOrder = {
  id: string;
  customerId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  initials: string;
  total: number;
  itemCount: number;
  payment: string;
};

const statusLabels: Record<string, OrderStatus> = {
  new: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentStatusLabels: Record<string, PaymentStatus> = {
  pending: "Pending",
  paid: "Paid",
  refunded: "Refunded",
  failed: "Failed",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function toAdminOrder(order: DatabaseOrder): AdminOrder {
  return {
    id: order.order_number,
    customerId: order.customer_id,
    status: statusLabels[order.fulfillment_status] ?? "New",
    paymentStatus: paymentStatusLabels[order.payment_status] ?? "Pending",
    createdAt: order.created_at,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    initials: getInitials(order.customer_name),
    total: order.total,
    itemCount: order.order_items?.length ?? 0,
    payment: order.payment_method ?? "Payment method unavailable",
  };
}