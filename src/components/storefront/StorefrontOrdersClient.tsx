"use client";

import { useState } from "react";
import type { StorefrontOrderViewInput } from "@/lib/storefront/storefrontOrderView";
import StorefrontOrderCard from "./StorefrontOrderCard";

type OrderFilter = "All" | "Pending" | "Processing" | "Shipping" | "Completed" | "Cancelled";

const tabs: OrderFilter[] = ["All", "Pending", "Processing", "Shipping", "Completed"];

type StorefrontOrdersClientProps = {
  orders: StorefrontOrderViewInput[];
  storeSlug: string;
};

export default function StorefrontOrdersClient({ orders, storeSlug }: StorefrontOrdersClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderFilter>("All");
  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "All") return true;
    const status = order.fulfillmentStatus === "new" ? "Pending" : order.fulfillmentStatus === "processing" ? "Processing" : order.fulfillmentStatus === "shipped" ? "Shipping" : order.fulfillmentStatus === "delivered" ? "Completed" : "Cancelled";
    return status === selectedStatus;
  });

  return (
    <>
      <section className="sticky top-16 z-40 border-b border-outline bg-background">
        <div className="no-scrollbar flex overflow-x-auto px-5">
          {tabs.map((tab) => {
            const isActive = tab === selectedStatus;
            return (
              <button key={tab} type="button" onClick={() => setSelectedStatus(tab)} className={isActive ? "whitespace-nowrap border-b-2 border-primary px-4 py-4 text-sm font-semibold text-primary transition" : "whitespace-nowrap border-b-2 border-transparent px-4 py-4 text-sm font-semibold text-on-surface-variant transition hover:text-primary"}>
                {tab}
              </button>
            );
          })}
        </div>
      </section>
      {filteredOrders.length === 0 ? (
        <section className="mx-5 mt-8 rounded-2xl bg-surface-low p-8 text-center">
          <h2 className="font-display text-2xl text-primary">No orders found</h2>
          <p className="mt-2 text-sm text-on-surface-variant">There are no orders in this category yet.</p>
        </section>
      ) : (
        <section className="mt-6 space-y-4 px-5">
          {filteredOrders.map((order) => <StorefrontOrderCard key={order.orderNumber} order={order} storeSlug={storeSlug} />)}
        </section>
      )}
    </>
  );
}
