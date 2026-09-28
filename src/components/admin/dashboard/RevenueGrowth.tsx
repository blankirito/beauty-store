import type { getReportingRevenueByDay } from "@/lib/admin/adminReporting";
import { BadgeCheck } from "lucide-react";

type RevenueGrowthProps = {
  revenueByDay: ReturnType<typeof getReportingRevenueByDay>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00+08:00`));
}

export default function RevenueGrowth({
  revenueByDay,
}: RevenueGrowthProps) {
  const peakRevenue = Math.max(
    ...revenueByDay.map((item) => item.revenue),
    0,
  );

  return (
    <section className="rounded-xl border border-outline/10 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Performance
        </p>
        <h2 className="font-display text-2xl text-on-surface">
          Revenue by Day
        </h2>
      </div>

      {revenueByDay.length === 0 ? (
        <div className="rounded-lg bg-surface-container p-4 text-sm text-on-surface-variant">
          No paid sales data is available yet.
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-end justify-between rounded-lg bg-surface-container px-3 py-2">
            <div>
              <p className="text-xs text-on-surface-variant">
                Highest daily revenue
              </p>
              <p className="font-display text-2xl font-semibold text-on-surface">
                {formatCurrency(peakRevenue)}
              </p>
            </div>

            <span className="flex items-center gap-1 text-xs font-medium text-primary">
              <BadgeCheck size={16} />
              {revenueByDay.length} sales day{revenueByDay.length === 1 ? "" : "s"}
            </span>
          </div>

          {revenueByDay.length === 1 ? (
            <div className="rounded-lg border border-outline/10 bg-surface px-3 py-3">
              <p className="text-xs text-on-surface-variant">
                Revenue recorded on
              </p>

              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-on-surface">
                  {formatDay(revenueByDay[0].date)}
                </p>

                <p className="font-display text-lg font-semibold text-primary">
                  {formatCurrency(revenueByDay[0].revenue)}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex h-40 items-end gap-2 border-b border-outline/20 px-1 pb-2">
                {revenueByDay.map((item) => {
                  const height = Math.max(
                    (item.revenue / peakRevenue) * 100,
                    8,
                  );

                  return (
                    <div
                      key={item.date}
                      className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[10px] font-medium text-on-surface-variant">
                        {formatCurrency(item.revenue)}
                      </span>

                      <div
                        className="w-full rounded-t-md bg-primary"
                        style={{ height: `${height}%` }}
                        title={`${formatDay(item.date)}: ${formatCurrency(item.revenue)}`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 flex gap-2 px-1">
                {revenueByDay.map((item) => (
                  <span
                    key={item.date}
                    className="min-w-0 flex-1 truncate text-center text-[10px] text-on-surface-variant"
                  >
                    {formatDay(item.date)}
                  </span>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}