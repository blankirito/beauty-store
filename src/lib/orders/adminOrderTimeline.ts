import type { OrderStatus } from "./adminOrder";

type DatabaseOrderEvent = {
  title: string;
  note: string | null;
  fulfillment_status: string | null;
  created_at: string;
};

export type AdminOrderTimelineEntry = {
  title: string;
  note: string | null;
  status: OrderStatus | null;
  createdAt: string;
};

const statusLabels: Record<string, OrderStatus> = {
  new: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function toAdminOrderTimeline(
  events: DatabaseOrderEvent[],
): AdminOrderTimelineEntry[] {
  return events.map((event) => ({
    title: event.title,
    note: event.note,
    status: event.fulfillment_status
      ? (statusLabels[event.fulfillment_status] ?? null)
      : null,
    createdAt: event.created_at,
  }));
}