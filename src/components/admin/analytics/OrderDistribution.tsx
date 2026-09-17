const orderStatuses = [
  { label: "Delivered", percentage: 90.9, color: "bg-primary" },
  { label: "Processing", percentage: 6.1, color: "bg-secondary" },
  { label: "Cancelled", percentage: 2, color: "bg-error" },
  { label: "Refunded", percentage: 1, color: "bg-outline" },
];

export default function OrderDistribution() {
  return (
    <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Fulfilment
      </p>

      <h2 className="mt-1 font-display text-2xl text-on-surface">
        Order Distribution
      </h2>

      <div className="mt-5 flex h-4 overflow-hidden rounded-full bg-surface-container-lowest">
        {orderStatuses.map((status) => (
          <div
            key={status.label}
            className={status.color}
            style={{ width: `${status.percentage}%` }}
            title={`${status.label}: ${status.percentage}%`}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        {orderStatuses.map((status) => (
          <div key={status.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />

            <div>
              <p className="text-xs text-on-surface-variant">{status.label}</p>
              <p className="text-sm font-semibold text-on-surface">
                {status.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}