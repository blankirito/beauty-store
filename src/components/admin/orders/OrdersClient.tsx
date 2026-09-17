"use client";

import { useState } from "react";
import {
  adminOrders,
  type OrderStatus,
} from "@/data/adminOrders";
import OrderList from "./OrderList";
import OrderStatusFilters from "./OrderStatusFilters";
import OrdersToolbar from "./OrdersToolbar";
import OrderPagination from "./OrderPagination";

type OrderFilter = "All" | OrderStatus;

export default function OrdersClient() {
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

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
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