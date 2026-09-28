import type { getReportingMetrics } from "@/lib/admin/adminReporting";
import {
  CircleDollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

type AnalyticsMetricsProps = {
  metrics: ReturnType<typeof getReportingMetrics>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function AnalyticsMetrics({
  metrics,
}: AnalyticsMetricsProps) {
  const cards = [
    {
      label: "Revenue",
      value: formatCurrency(metrics.revenue),
      description: "Paid, non-cancelled orders",
      icon: CircleDollarSign,
    },
    {
      label: "Paid Orders",
      value: metrics.paidOrderCount.toString(),
      description: "Completed payment records",
      icon: ShoppingBag,
    },
    {
      label: "Avg. Order Value",
      value: formatCurrency(metrics.averageOrderValue),
      description: "Across paid orders",
      icon: TrendingUp,
    },
  ];

  return (
    <section>
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Business Performance
        </p>
        <h2 className="mt-1 font-display text-2xl text-on-surface">
          Key Metrics
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-outline/10 bg-white p-3.5 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container text-primary">
                <Icon size={19} />
              </div>

              <p className="mt-4 text-xs text-on-surface-variant">
                {metric.label}
              </p>

              <p className="mt-1 font-display text-xl font-semibold text-on-surface">
                {metric.value}
              </p>

              <p className="mt-1 text-[11px] text-on-surface-variant">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
