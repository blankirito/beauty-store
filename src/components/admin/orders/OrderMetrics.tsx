import {
  CircleDollarSign,
  ShoppingBag,
  TriangleAlert,
  Truck,
} from "lucide-react";

type OrderMetricsProps = {
  metrics: {
    totalOrderCount: number;
    actionRequiredCount: number;
    shippedOrderCount: number;
    paidRevenue: number;
  };
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function OrderMetrics({
  metrics,
}: OrderMetricsProps) {
  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Total Orders
          </p>

          <ShoppingBag size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          {metrics.totalOrderCount}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          In your current store
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Requires Action
          </p>

          <TriangleAlert size={17} className="text-error" />
        </div>

        <p className="font-display text-2xl font-bold text-error">
          {metrics.actionRequiredCount}
        </p>

        <p className="text-[10px] font-medium text-error">
          New and processing orders
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Shipped
          </p>

          <Truck size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          {metrics.shippedOrderCount}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Orders on their way
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Paid Revenue
          </p>

          <CircleDollarSign size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          {formatCurrency(metrics.paidRevenue)}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Paid orders only
        </p>
      </article>
    </section>
  );
}