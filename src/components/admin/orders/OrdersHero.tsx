import { Download } from "lucide-react";

export default function OrdersHero() {
  return (
    <section className="space-y-3.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Order Management
          </p>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">
            Orders
          </h1>
        </div>

        <button
          type="button"
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold tracking-wide text-on-primary shadow-sm transition-all hover:bg-on-primary-container active:scale-[0.98]"
        >
          <Download size={16} />
          Export Orders
        </button>
      </div>

      <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
        Track, process, and manage customer boutique orders and fulfillment
        status.
      </p>
    </section>
  );
}