import type { getReportingMetrics } from "@/lib/admin/adminReporting";
import { ShoppingBag, TrendingUp, WalletCards } from "lucide-react";

type DashboardMetricsProps = {
  metrics: ReturnType<typeof getReportingMetrics>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function DashboardMetrics({
  metrics,
}: DashboardMetricsProps) {
  return (
    <section className="grid gap-3.5">
      <article className="rounded-xl border border-outline/10 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary">
            <WalletCards size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Total Sales
            </p>
            <p className="font-display text-2xl font-semibold text-on-surface">
              {formatCurrency(metrics.revenue)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-on-surface-variant">
          Paid orders that have not been cancelled
        </p>
      </article>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-xl border border-outline/10 bg-white p-3.5 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
            <ShoppingBag size={18} />
          </div>

          <p className="mt-3 text-xs text-on-surface-variant">Paid Orders</p>
          <p className="font-display text-2xl font-semibold text-on-surface">
            {metrics.paidOrderCount}
          </p>
        </article>

        <article className="rounded-xl border border-outline/10 bg-white p-3.5 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
            <TrendingUp size={18} />
          </div>

          <p className="mt-3 text-xs text-on-surface-variant">
            Avg. Order Value
          </p>
          <p className="font-display text-xl font-semibold text-on-surface">
            {formatCurrency(metrics.averageOrderValue)}
          </p>
        </article>
      </div>
    </section>
  );
}