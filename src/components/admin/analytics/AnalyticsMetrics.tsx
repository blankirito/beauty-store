import {
  ChartNoAxesCombined,
  CircleDollarSign,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

const metrics = [
  {
    label: "Revenue",
    value: "RM48,290",
    change: "+18.4%",
    description: "vs previous period",
    icon: CircleDollarSign,
  },
  {
    label: "Total Orders",
    value: "1,412",
    change: "+11.2%",
    description: "vs previous period",
    icon: ShoppingBag,
  },
  {
    label: "Avg. Order Value",
    value: "RM82.40",
    change: "+6.5%",
    description: "vs previous period",
    icon: TrendingUp,
  },
  {
    label: "Conversion Rate",
    value: "3.82%",
    change: "+0.6%",
    description: "vs previous period",
    icon: ChartNoAxesCombined,
  },
];

export default function AnalyticsMetrics() {
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
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-2xl bg-surface-container-low p-3.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container text-primary">
                  <Icon size={19} />
                </div>

                <span className="rounded-full bg-primary-container px-2 py-1 text-[11px] font-semibold text-on-primary-container">
                  {metric.change}
                </span>
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