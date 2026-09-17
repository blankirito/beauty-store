"use client";

import { ChevronDown } from "lucide-react";
import type { CustomerStatus } from "@/data/adminCustomers";

type CustomerFilter = "All" | CustomerStatus;

type CustomerFiltersProps = {
  selectedStatus: CustomerFilter;
  onStatusChange: (status: CustomerFilter) => void;
  totalCustomers: number;
};

const statusOptions: CustomerFilter[] = [
  "All",
  "VIP",
  "Active",
  "New",
  "Inactive",
];

export default function CustomerFilters({
  selectedStatus,
  onStatusChange,
  totalCustomers,
}: CustomerFiltersProps) {
  return (
    <section className="space-y-3">
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
                  ? "flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary shadow-sm"
                  : "flex flex-shrink-0 items-center gap-1.5 rounded-full border border-outline/25 bg-surface-container-lowest px-3 py-1.5 text-xs font-medium text-on-surface"
              }
            >
              {status === "All" ? "All Customers" : status}

              {status === "All" && (
                <span className="rounded-full bg-on-primary/20 px-1.5 py-0.5 text-[10px]">
                  {totalCustomers}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <button
            type="button"
            className="flex items-center gap-1 rounded-xl border border-outline/25 bg-surface-container-lowest px-2.5 py-1.5 text-xs text-on-surface"
          >
            Sort: Highest Spent
            <ChevronDown size={14} className="text-on-surface-variant" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1 rounded-xl border border-outline/25 bg-surface-container-lowest px-2.5 py-1.5 text-xs text-on-surface"
          >
            Tiers
            <ChevronDown size={14} className="text-on-surface-variant" />
          </button>
        </div>

        <span className="text-[11px] text-on-surface-variant">
          Showing{" "}
          <strong className="text-on-surface">
            {totalCustomers === 0 ? 0 : `1–${Math.min(5, totalCustomers)}`}
          </strong>{" "}
          of {totalCustomers}
        </span>
      </div>
    </section>
  );
}