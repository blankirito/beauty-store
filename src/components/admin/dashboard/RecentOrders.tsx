import type { AdminOrder, OrderStatus } from "@/lib/orders/adminOrder";
import Link from "next/link";

type RecentOrdersProps = {
  orders: AdminOrder[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

function getStatusClass(status: OrderStatus) {
  if (status === "Processing") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (status === "Cancelled") {
    return "bg-error-container text-on-error-container";
  }

  return "bg-primary-container/40 text-on-primary-container";
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const recentOrders = orders.slice(0, 4);

  return (
    <section className="space-y-3 pt-1">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Transactions
        </p>
        <h2 className="font-display text-2xl text-on-surface">
          Recent Orders
        </h2>
      </div>

      {recentOrders.length === 0 ? (
        <div className="rounded-xl border border-outline/10 bg-white p-4 text-sm text-on-surface-variant shadow-sm">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block space-y-3 rounded-xl border border-outline/10 bg-white p-3.5 shadow-sm transition hover:opacity-80"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-sm font-semibold tracking-wide text-on-surface">
                    #{order.id}
                  </span>
                  <span className="truncate text-xs text-on-surface-variant">
                    · {formatDate(order.createdAt)}
                  </span>
                </div>

                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {order.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-xs font-bold text-on-surface">
                    {order.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium leading-none text-on-surface">
                      {order.customerName}
                    </p>
                    <p className="mt-1 truncate text-xs text-on-surface-variant">
                      {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-on-surface">
                    {formatCurrency(order.total)}
                  </p>
                  <p
                    className={
                      order.paymentStatus === "Refunded"
                        ? "text-xs text-error"
                        : "text-xs text-on-surface-variant"
                    }
                  >
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/admin/orders"
        className="inline-flex px-1 pt-2 text-xs font-semibold text-primary transition hover:opacity-75"
      >
        View all orders
      </Link>
    </section>
  );
}