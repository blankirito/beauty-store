"use client";

import Link from "next/link";
import { useState } from "react";
import {
  adminOrders,
  type OrderStatus,
} from "@/data/adminOrders";
import { getAdminOrderDetail } from "@/data/adminOrderDetails";
import OrderList from "./OrderList";
import OrderStatusFilters from "./OrderStatusFilters";
import OrdersToolbar from "./OrdersToolbar";
import OrderPagination from "./OrderPagination";

type OrderFilter = "All" | OrderStatus;

type OrdersClientProps = {
  customerId?: string;
  customerName?: string;
};

export default function OrdersClient({
  customerId,
  customerName,
}: OrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderFilter>("All");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredOrders = adminOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(normalizedQuery) ||
      order.customerName.toLowerCase().includes(normalizedQuery) ||
      order.customerEmail.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    const matchesCustomer =
      !customerId ||
      getAdminOrderDetail(order.id).customerId === customerId;

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  return (
    <div className="space-y-6">
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
        totalOrders={filteredOrders.length}
      />

      <OrderList items={filteredOrders} />
      <OrderPagination totalOrders={filteredOrders.length} />
    </div>
  );
}