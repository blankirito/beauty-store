import { MoreHorizontal } from "lucide-react";
import type { AdminOrder } from "@/data/adminOrders";

type OrderListProps = {
  items: AdminOrder[];
};

function getActionLabel(status: AdminOrder["status"]) {
  if (status === "New") return "Process Order";
  if (status === "Processing") return "Mark as Shipped";
  if (status === "Shipped") return "Track Shipment";
  if (status === "Delivered") return "Receipt / Invoice";
  return null;
}

function getStatusClass(status: AdminOrder["status"]) {
  if (status === "New" || status === "Cancelled") {
    return "bg-error-container text-error";
  }

  if (status === "Processing") {
    return "bg-secondary-container text-on-secondary-container";
  }

  return "bg-primary-container/40 text-on-primary-container";
}

export default function OrderList({ items }: OrderListProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-8 text-center shadow-sm">
        <p className="font-display text-xl text-on-surface">No orders found</p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Try a different customer name, order ID, or status.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {items.slice(0, 5).map((order) => {
        const actionLabel = getActionLabel(order.status);

        return (
          <article
            key={order.id}
            className="space-y-3 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 border-b border-outline/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-on-surface">
                  #{order.id}
                </span>

                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <span className="text-right text-[11px] text-on-surface-variant">
                {order.date}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-xs font-bold text-primary">
                  {order.initials}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-on-surface">
                    {order.customerName}
                  </h3>
                  <p className="truncate text-xs text-on-surface-variant">
                    {order.customerEmail}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="font-display text-lg font-bold text-on-surface">
                  RM{order.total.toFixed(2)}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {order.itemCount} items · {order.payment}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-outline/10 pt-2">
              {actionLabel ? (
                <button
                  type="button"
                  className={
                    order.status === "New" || order.status === "Processing"
                      ? "rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary"
                      : "rounded-xl bg-surface-container px-3.5 py-1.5 text-xs font-semibold text-on-surface"
                  }
                >
                  {actionLabel}
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                aria-label={`More options for ${order.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-container"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}