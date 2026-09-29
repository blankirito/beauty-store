"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CustomerSort } from "@/lib/admin/adminListControls";
import type { AdminCustomerStatus } from "@/lib/admin/adminCustomerReporting";

type CustomerFilter = "All" | AdminCustomerStatus;

type CustomerFiltersProps = {
  selectedStatus: CustomerFilter;
  onStatusChange: (status: CustomerFilter) => void;
  selectedSort: CustomerSort;
  onSortChange: (sort: CustomerSort) => void;
  totalCustomers: number;
};

const statusOptions: CustomerFilter[] = [
  "All",
  "VIP",
  "Active",
  "New",
  "Inactive",
];

const sortOptions: CustomerSort[] = [
  "highest_spent",
  "most_recent",
  "oldest_customer",
];

const sortLabels: Record<CustomerSort, string> = {
  highest_spent: "Highest spent",
  most_recent: "Most recent",
  oldest_customer: "Oldest customer",
};

export default function CustomerFilters({
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
  totalCustomers,
}: CustomerFiltersProps) {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

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

      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSortMenuOpen((isOpen) => !isOpen)}
            className="flex items-center gap-1 rounded-xl border border-outline/25 bg-surface-container-lowest px-2.5 py-1.5 text-xs text-on-surface"
          >
            Sort: {sortLabels[selectedSort]}
            <ChevronDown
              size={14}
              className={`text-on-surface-variant transition-transform ${
                isSortMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortMenuOpen && (
            <div className="absolute left-0 top-9 z-30 w-40 overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest p-1.5 shadow-lg">
              {sortOptions.map((sort) => {
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