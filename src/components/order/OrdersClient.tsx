"use client";

import { useState } from "react";
import { customerOrders } from "@/data/customerOrders";
import OrderList from "./OrderList";
import OrderTabs, { type OrderFilter } from "./OrderTabs";

export default function OrdersClient() {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderFilter>("All");

  const filteredOrders = customerOrders.filter(
    (order) =>
      selectedStatus === "All" || order.status === selectedStatus,
  );

  return (
    <>
      <OrderTabs
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <OrderList items={filteredOrders} />
    </>
  );
}