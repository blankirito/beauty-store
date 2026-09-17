"use client";

import type { OrderStatus } from "@/data/adminOrders";

type OrderFilter = "All" | OrderStatus;

type OrderStatusFiltersProps = {
  selectedStatus: OrderFilter;
  onStatusChange: (status: OrderFilter) => void;
  totalOrders: number;
};

const statusOptions: OrderFilter[] = [
  "All",
  "New",
  "Processing",
  "Shipped",
  "Delivered",
];

export default function OrderStatusFilters({
  selectedStatus,
  onStatusChange,
  totalOrders,
}: OrderStatusFiltersProps) {
  return (
    <section className="space-y-3 pt-1">
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
        {statusOptions.map((status) => {
          const isActive = selectedStatus === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(status)}
              className={
                isActive
                  ? "flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-sm"
                  : "flex flex-shrink-0 items-center gap-1.5 rounded-full border border-outline/30 bg-surface-container-lowest px-3.5 py-2 text-xs font-medium text-on-surface shadow-sm transition-colors hover:border-primary"
              }
            >
              {status === "All" ? "All Orders" : status}

              {status === "All" && (
                <span className="rounded-full bg-on-primary/20 px-1.5 py-0.5 text-[10px]">
                  {totalOrders}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-outline/30 bg-surface-container-lowest px-2.5 py-1.5 text-xs font-medium text-on-surface"
          >
            Last 30 Days
          </button>

          <button
            type="button"
            className="rounded-lg border border-outline/30 bg-surface-container-lowest px-2.5 py-1.5 text-xs font-medium text-on-surface"
          >
            Newest
          </button>
        </div>

        <span>
          Showing <strong className="text-on-surface">1–{Math.min(5, totalOrders)}</strong> of {totalOrders}
        </span>
      </div>
    </section>
  );
}