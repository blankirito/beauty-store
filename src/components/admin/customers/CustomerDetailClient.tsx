"use client";

import type { AdminReportingCustomer } from "@/lib/admin/adminCustomerReporting";
import type { AdminOrder, OrderStatus } from "@/lib/orders/adminOrder";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type CustomerDetailClientProps = {
  customer: AdminReportingCustomer;
  recentOrders: AdminOrder[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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

function getStatusClass(status: string) {
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

function getOrderStatusClass(status: OrderStatus) {
  if (status === "New" || status === "Cancelled") {
    return "bg-error-container text-error";
  }

  if (status === "Processing") {
    return "bg-secondary-container text-on-secondary-container";
  }

  return "bg-primary-container/40 text-on-primary-container";
}

export default function CustomerDetailClient({
  customer,
  recentOrders,
}: CustomerDetailClientProps) {
  const [isCustomerIdCopied, setIsCustomerIdCopied] = useState(false);

  const averageOrderValue =
    customer.orderCount > 0
      ? customer.totalSpent / customer.orderCount
      : 0;

  const status = customer.status ?? "Active";

  async function handleCopyCustomerId() {
    await navigator.clipboard.writeText(customer.id);
    setIsCustomerIdCopied(true);

    window.setTimeout(() => {
      setIsCustomerIdCopied(false);
    }, 1800);
  }

  return (
    <main className="min-h-screen space-y-5 bg-surface px-5 py-6 pb-10">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
        >
          <ArrowLeft size={17} />
          Customers
        </Link>

        <span className="text-xs text-on-surface-variant">
          Customer details
        </span>
      </div>

      <section className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface-container text-lg font-bold text-primary">
            {getInitials(customer.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-display text-2xl text-on-surface">
                {customer.name}
              </h1>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(status)}`}
              >
                {status === "VIP" ? "VIP Member" : status}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="truncate text-xs text-on-surface-variant">
                {customer.isGuest ? "Guest checkout customer" : customer.id}
              </span>

              {!customer.isGuest && (
                <button
                  type="button"
                  onClick={handleCopyCustomerId}
                  aria-label="Copy customer ID"
                  className="shrink-0 text-on-surface-variant transition hover:text-primary"
                >
                  {isCustomerIdCopied ? (
                    <Check size={15} />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-on-surface-variant">
              Member since {formatDate(customer.firstOrderAt)}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 border-t border-outline/20 pt-4 text-sm">
          <div className="flex items-center gap-2 text-on-surface">
            <Mail size={16} className="text-primary" />
            <span className="truncate">{customer.email}</span>
          </div>

          <div className="flex items-center gap-2 text-on-surface">
            <Phone size={16} className="text-primary" />
            <span>{customer.phone ?? "Phone number unavailable"}</span>
          </div>

          <div className="flex items-center gap-2 text-on-surface">
            <MapPin size={16} className="text-primary" />
            <span>{customer.location}</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl border border-outline/10 bg-white p-3.5 shadow-sm">
          <ShoppingBag size={18} className="text-primary" />
          <p className="mt-3 text-xs text-on-surface-variant">Total Orders</p>
          <p className="mt-1 font-display text-2xl font-semibold text-on-surface">
            {customer.orderCount}
          </p>
        </article>

        <article className="rounded-2xl border border-outline/10 bg-white p-3.5 shadow-sm">
          <WalletCards size={18} className="text-primary" />
          <p className="mt-3 text-xs text-on-surface-variant">Total Spent</p>
          <p className="mt-1 font-display text-xl font-semibold text-on-surface">
            {formatCurrency(customer.totalSpent)}
          </p>
        </article>

        <article className="rounded-2xl border border-outline/10 bg-white p-3.5 shadow-sm">
          <WalletCards size={18} className="text-primary" />
          <p className="mt-3 text-xs text-on-surface-variant">
            Avg. Order Value
          </p>
          <p className="mt-1 font-display text-xl font-semibold text-on-surface">
            {formatCurrency(averageOrderValue)}
          </p>
        </article>

        <article className="rounded-2xl border border-outline/10 bg-white p-3.5 shadow-sm">
          <CalendarDays size={18} className="text-primary" />
          <p className="mt-3 text-xs text-on-surface-variant">Last Order</p>
          <p className="mt-1 font-display text-xl font-semibold text-on-surface">
            {formatDate(customer.lastOrderAt)}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
        <div className="border-b border-outline/20 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Recent Orders
          </p>
        </div>

        {recentOrders.length > 0 ? (
          <div className="mt-3 space-y-2.5">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-xl border border-outline/15 bg-surface-container-lowest p-3 transition hover:border-primary/35"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      #{order.id}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getOrderStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>

                    <p className="mt-2 font-display text-lg font-semibold text-on-surface">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-surface-container-lowest p-3 text-sm text-on-surface-variant">
            No orders are available for this customer.
          </p>
        )}
      </section>
    </main>
  );
}