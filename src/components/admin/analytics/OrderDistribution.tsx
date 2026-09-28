import type { getReportingOrderDistribution } from "@/lib/admin/adminReporting";

type OrderDistributionProps = {
  distribution: ReturnType<typeof getReportingOrderDistribution>;
};

const statusColors: Record<string, string> = {
  New: "bg-sky-500",
  Processing: "bg-amber-500",
  Shipped: "bg-violet-500",
  Delivered: "bg-emerald-600",
  Cancelled: "bg-rose-600",
};

const statusDescriptions: Record<string, string> = {
  New: "Awaiting fulfilment",
  Processing: "Being prepared",
  Shipped: "On the way",
  Delivered: "Completed",
  Cancelled: "Stopped",
};

export default function OrderDistribution({
  distribution,
}: OrderDistributionProps) {
  const totalOrders = distribution.reduce(
    (total, item) => total + item.count,
    0,
  );

  return (
    <section className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Fulfilment
      </p>

      <h2 className="mt-1 font-display text-2xl text-on-surface">
        Order Distribution
      </h2>

      <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
        See how many orders are currently at each fulfilment stage.
      </p>

      {totalOrders === 0 ? (
        <div className="mt-5 rounded-xl bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
          No orders are available yet.
        </div>
      ) : (
        <>
          <div className="mt-5 flex h-4 overflow-hidden rounded-full bg-surface-container-lowest">
            {distribution.map((item) => {
              const percentage = (item.count / totalOrders) * 100;

              return (
                <div
                  key={item.status}
                  className={statusColors[item.status]}
                  style={{ width: `${percentage}%` }}
                  title={`${item.status}: ${item.count} orders`}
                />
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
            {distribution.map((item) => {
              const percentage = Math.round(
                (item.count / totalOrders) * 100,
              );

              return (
                <div key={item.status} className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${statusColors[item.status]}`}
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface">
                      {item.status}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {statusDescriptions[item.status]}
                    </p>
                    <p className="text-sm font-semibold text-on-surface">
                      {item.count} · {percentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
