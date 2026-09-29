"use client";

import Link from "next/link";
import { useState } from "react";
import {
  filterAndSortAdminOrders,
  type OrderDateRange,
  type OrderSort,
} from "@/lib/admin/adminListControls";
import type {
  AdminOrder,
  OrderStatus,
} from "@/lib/orders/adminOrder";
import OrderList from "./OrderList";
import OrderStatusFilters from "./OrderStatusFilters";
import OrdersToolbar from "./OrdersToolbar";
import OrderPagination from "./OrderPagination";
import { buildAdminOrdersCsv } from "@/lib/admin/adminListControls";
import type { getAdminOrderMetrics } from "@/lib/orders/adminOrderMetrics";
import OrderMetrics from "./OrderMetrics";
import OrdersHero from "./OrdersHero";

type OrderFilter = "All" | OrderStatus;

type OrdersClientProps = {
  customerId?: string;
  customerName?: string;
  orders: AdminOrder[];
  metrics: ReturnType<typeof getAdminOrderMetrics>;
};

export default function OrdersClient({
  orders,
  metrics,
  customerId,
  customerName,
}: OrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderFilter>("All");
  const [selectedDateRange, setSelectedDateRange] =
    useState<OrderDateRange>("all");
  const [selectedSort, setSelectedSort] = useState<OrderSort>("newest");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchingOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(normalizedQuery) ||
      order.customerName.toLowerCase().includes(normalizedQuery) ||
      order.customerEmail.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    const matchesCustomer =
      !customerId ||
      order.customerId === customerId;

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const filteredOrders = filterAndSortAdminOrders(matchingOrders, {
    dateRange: selectedDateRange,
    sort: selectedSort,
    now: new Date(),
  });

    function handleExport() {
    const csv = buildAdminOrdersCsv(filteredOrders);
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <OrdersHero onExport={handleExport} />
      <OrderMetrics metrics={metrics} />
      {customerId && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary-container/25 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Customer order history
            </p>

            <p className="mt-1 text-sm font-semibold text-on-surface">
              Showing orders from {customerName ?? customerId}
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="rounded-xl bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-primary shadow-sm transition hover:bg-surface-container"
          >
            Clear filter
          </Link>
        </section>
      )}

      <OrdersToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <OrderStatusFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        totalOrders={filteredOrders.length}
      />

      <OrderList items={filteredOrders} />
      <OrderPagination totalOrders={filteredOrders.length} />
    </div>
  );
}