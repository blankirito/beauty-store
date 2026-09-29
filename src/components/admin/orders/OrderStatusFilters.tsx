"use client";

import { Check, ChevronDown } from "lucide-react";
import type { OrderDateRange, OrderSort } from "@/lib/admin/adminListControls";
import type { OrderStatus } from "@/lib/orders/adminOrder";
import { useState } from "react";

type OrderFilter = "All" | OrderStatus;

type OrderStatusFiltersProps = {
  selectedStatus: OrderFilter;
  onStatusChange: (status: OrderFilter) => void;
  selectedDateRange: OrderDateRange;
  onDateRangeChange: (range: OrderDateRange) => void;
  selectedSort: OrderSort;
  onSortChange: (sort: OrderSort) => void;
  totalOrders: number;
};

const statusOptions: OrderFilter[] = [
  "All",
  "New",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const dateRangeLabels: Record<OrderDateRange, string> = {
  all: "All time",
  last_30_days: "Last 30 days",
};

const sortLabels: Record<OrderSort, string> = {
  newest: "Newest",
  oldest: "Oldest",
};

export default function OrderStatusFilters({
  selectedStatus,
  onStatusChange,
  selectedDateRange,
  onDateRangeChange,
  selectedSort,
  onSortChange,
  totalOrders,
}: OrderStatusFiltersProps) {
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

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

      <div className="flex items-center justify-between gap-3 px-1 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDateMenuOpen((isOpen) => !isOpen);
                setIsSortMenuOpen(false);
              }}
              className="flex items-center gap-1 rounded-lg border border-outline/30 bg-surface-container-lowest px-2.5 py-1.5 text-xs font-medium text-on-surface"
            >
              {dateRangeLabels[selectedDateRange]}
              <ChevronDown size={14} />
            </button>

            {isDateMenuOpen && (
              <div className="absolute left-0 top-9 z-30 w-36 overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest p-1.5 shadow-lg">
                {(Object.keys(dateRangeLabels) as OrderDateRange[]).map(
                  (range) => {
                    const isSelected = selectedDateRange === range;

                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          onDateRangeChange(range);
                          setIsDateMenuOpen(false);
                        }}
                        className={
                          isSelected
                            ? "flex w-full items-center justify-between rounded-lg bg-primary-container/40 px-3 py-2 text-left text-xs font-semibold text-primary"
                            : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-on-surface hover:bg-surface-container"
                        }
                      >
                        {dateRangeLabels[range]}
                        {isSelected && <Check size={15} />}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortMenuOpen((isOpen) => !isOpen);
                setIsDateMenuOpen(false);
              }}
              className="flex items-center gap-1 rounded-lg border border-outline/30 bg-surface-container-lowest px-2.5 py-1.5 text-xs font-medium text-on-surface"
            >
              {sortLabels[selectedSort]}
              <ChevronDown size={14} />
            </button>

            {isSortMenuOpen && (
              <div className="absolute left-0 top-9 z-30 w-32 overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest p-1.5 shadow-lg">
                {(Object.keys(sortLabels) as OrderSort[]).map((sort) => {
                  const isSelected = selectedSort === sort;

                  return (
                    <button
                      key={sort}
                      type="button"
                      onClick={() => {
                        onSortChange(sort);
                        setIsSortMenuOpen(false);
                      }}
                      className={
                        isSelected
                          ? "flex w-full items-center justify-between rounded-lg bg-primary-container/40 px-3 py-2 text-left text-xs font-semibold text-primary"
                          : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-on-surface hover:bg-surface-container"
                      }
                    >
                      {sortLabels[sort]}
                      {isSelected && <Check size={15} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <span className="whitespace-nowrap">
          Showing{" "}
          <strong className="text-on-surface">
            {totalOrders === 0 ? 0 : `1–${Math.min(5, totalOrders)}`}
          </strong>{" "}
          of {totalOrders}
        </span>
      </div>
    </section>
  );
}