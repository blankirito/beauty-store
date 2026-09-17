import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";

const recentOrders = [
  {
    id: "BT-9241",
    date: "24 Oct 2026",
    customer: "Emma Miller",
    initials: "EM",
    product: "Glow Serum",
    total: "RM89.00",
    status: "Delivered",
    payment: "Paid",
  },
  {
    id: "BT-9240",
    date: "24 Oct 2026",
    customer: "James Davis",
    initials: "JD",
    product: "Vitamin C Serum",
    total: "RM45.00",
    status: "Processing",
    payment: "Paid",
  },
  {
    id: "BT-9239",
    date: "23 Oct 2026",
    customer: "Sarah White",
    initials: "SW",
    product: "Hydrating Face Cream",
    total: "RM185.00",
    status: "Cancelled",
    payment: "Refunded",
  },
  {
    id: "BT-9238",
    date: "23 Oct 2026",
    customer: "Robert Brown",
    initials: "RB",
    product: "Gentle Facial Cleanser",
    total: "RM39.00",
    status: "Delivered",
    payment: "Paid",
  },
];

function getStatusClass(status: string) {
  if (status === "Processing") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (status === "Cancelled") {
    return "bg-error-container text-on-error-container";
  }

  return "bg-primary-container/40 text-on-primary-container";
}

export default function RecentOrders() {
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

      <div className="flex items-center gap-2">
        <label className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Search orders..."
            className="h-11 w-full rounded-xl bg-surface-container-low pl-10 pr-3 text-sm text-on-surface shadow-sm outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <button
          type="button"
          aria-label="Filter orders"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-high"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-3 pt-1">
        {recentOrders.map((order) => (
          <article
            key={order.id}
            className="space-y-3 rounded-xl bg-surface-container-low p-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-on-surface">
                  #{order.id}
                </span>
                <span className="truncate text-xs text-on-surface-variant">
                  · {order.date}
                </span>
              </div>

              <span
                className={`flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(order.status)}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-xs font-bold text-on-surface">
                  {order.initials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-none text-on-surface">
                    {order.customer}
                  </p>
                  <p className="mt-1 truncate text-xs text-on-surface-variant">
                    {order.product}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-semibold text-on-surface">
                  {order.total}
                </p>
                <p
                  className={
                    order.payment === "Refunded"
                      ? "text-xs text-error"
                      : "text-xs text-on-surface-variant"
                  }
                >
                  {order.payment}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between px-1 pt-2">
        <span className="text-xs text-on-surface-variant">
          Showing 1 to 4 of 50
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 items-center gap-1 rounded-lg bg-surface-container px-3 text-xs font-medium text-on-surface-variant shadow-sm"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <button
            type="button"
            className="flex h-10 items-center gap-1 rounded-lg bg-secondary px-3 text-xs font-semibold text-on-secondary shadow-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}