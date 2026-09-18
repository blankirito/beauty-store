import type { CustomerOrder } from "@/data/customerOrders";
import type { Products } from "@/types/products";
import { ChevronRight, Truck } from "lucide-react";
import Link from "next/link";

type OrderCardProps = {
  order: CustomerOrder;
  product: Products;
};

function getStatusClass(status: CustomerOrder["status"]) {
  if (status === "Pending") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (status === "Processing") {
    return "bg-primary-container/35 text-on-primary-container";
  }

  if (status === "Shipping") {
    return "bg-primary text-white";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function OrderCard({
  order,
  product,
}: OrderCardProps) {
  const hasMultipleItems = order.items.length > 1;
  const canTrack = order.status === "Shipping";

  return (
    <article className="space-y-4 rounded-xl bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Order #{order.id}
          </p>

          <p className="mt-1 text-sm text-outline">
            Placed on {order.date}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </div>

      <Link
        href={`/orders/${order.id}`}
        className="flex items-center gap-4 rounded-lg transition active:opacity-70"
      >
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-low">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-medium text-primary">
            {product.name}
          </h3>

          <p className="mt-1 text-sm text-on-surface-variant">
            {order.items[0].quantity} item
            {order.items[0].quantity > 1 ? "s" : ""}
            {hasMultipleItems && ` · +${order.items.length - 1} more`}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-primary">
            RM{order.total.toFixed(2)}
          </p>

          <ChevronRight size={18} className="ml-auto mt-1 text-outline" />
        </div>
      </Link>

      <div className="flex gap-3 border-t border-outline/60 pt-4">
        {canTrack && (
          <Link
            href={`/orders/${order.id}/track`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Truck size={18} />
            Track Order
          </Link>
        )}

        <Link
          href={`/orders/${order.id}`}
          className={
            canTrack
              ? "flex items-center justify-center rounded-xl border-2 border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
              : "flex flex-1 items-center justify-center rounded-xl border-2 border-primary py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
          }
        >
          View Details
        </Link>
      </div>
    </article>
  );
}