import { CircleDot, Sparkles, Star, Users } from "lucide-react";

type CustomerMetricsProps = {
  metrics: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    vipCustomers: number;
  };
};

export default function CustomerMetrics({
  metrics,
}: CustomerMetricsProps) {
  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">
            Total Customers
          </p>
          <Users size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          {metrics.totalCustomers.toLocaleString("en-MY")}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Customers with paid orders
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">
            Active Customers
          </p>
          <CircleDot size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          {metrics.activeCustomers.toLocaleString("en-MY")}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Ordered in last 90d
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">
            New Customers
          </p>
          <Sparkles size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          {metrics.newCustomers.toLocaleString("en-MY")}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          First order this month
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">
            VIP Customers
          </p>
          <Star size={17} className="fill-primary text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          {metrics.vipCustomers.toLocaleString("en-MY")}
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Lifetime spend of RM1,000+
        </p>
      </article>
    </section>
  );
}