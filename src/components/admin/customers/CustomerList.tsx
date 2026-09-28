"use client";

import { MapPin } from "lucide-react";
import type {
  AdminCustomerStatus,
  AdminReportingCustomer,
} from "@/lib/admin/adminCustomerReporting";
import Link from "next/link";

type CustomerListProps = {
  items: AdminReportingCustomer[];
};

function getStatusClass(status: AdminCustomerStatus) {
  if (status === "VIP") {
    return "bg-primary-container/50 text-on-primary-container";
  }

  if (status === "Active") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (status === "New") {
    return "bg-surface-container text-primary";
  }

  return "bg-surface-container text-on-surface-variant";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatMemberSince(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function CustomerList({ items }: CustomerListProps) {
  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-8 text-center shadow-sm">
        <p className="font-display text-xl text-on-surface">
          No customers found
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Try another name, email, phone number, or customer status.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {items.slice(0, 5).map((customer) => {
        const status = customer.status ?? "Active";

        return (
          <article
            key={customer.id}
            className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between border-b border-outline/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">
                  {customer.isGuest ? "Guest customer" : `#${customer.id}`}
                </span>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(status)}`}
                >
                  {status === "VIP"
                    ? "VIP Member"
                    : status === "New"
                      ? "New Customer"
                      : status}
                </span>
              </div>

              <span className="text-[10px] text-on-surface-variant">
                Member since {formatMemberSince(customer.firstOrderAt)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-sm font-bold text-primary">
                {getInitials(customer.name)}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-on-surface">
                  {customer.name}
                </h2>

                <p className="truncate text-xs text-on-surface-variant">
                  {customer.email}
                </p>

                <p className="mt-1 flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <MapPin size={13} />
                  <span className="truncate">{customer.location}</span>
                </p>
              </div>
            </div>

            <div className="my-3 grid grid-cols-3 gap-2 rounded-xl border border-outline/10 bg-surface p-2.5 text-center">
              <div>
                <p className="text-[10px] text-on-surface-variant">Orders</p>
                <p className="text-xs font-bold text-on-surface">
                  {customer.orderCount} orders
                </p>
              </div>

              <div className="border-x border-outline/15">
                <p className="text-[10px] text-on-surface-variant">
                  Total Spent
                </p>
                <p className="font-display text-xs font-bold text-primary">
                  RM{customer.totalSpent.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-on-surface-variant">
                  Last Order
                </p>
                <p className="text-xs font-semibold text-on-surface">
                  {formatDate(customer.lastOrderAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">
                {customer.isGuest
                  ? "Guest checkout customer"
                  : "Registered customer account"}
              </p>

              <Link
                href={`/admin/customers/${encodeURIComponent(customer.id)}`}
                className="text-xs font-semibold text-primary transition hover:opacity-75"
              >
                View details
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}