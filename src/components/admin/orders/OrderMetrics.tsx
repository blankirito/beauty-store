import {
  CircleDollarSign,
  ShoppingBag,
  TriangleAlert,
  Truck,
} from "lucide-react";

export default function OrderMetrics() {
  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Total Orders
          </p>

          <span className="rounded-full bg-primary-container/40 px-1.5 py-0.5 text-[10px] font-semibold text-on-primary-container">
            +12%
          </span>
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          1,284
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Across 8 active channels
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Processing
          </p>

          <TriangleAlert size={17} className="text-error" />
        </div>

        <p className="font-display text-2xl font-bold text-error">42</p>

        <p className="text-[10px] font-medium text-error">
          Requiring action
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Shipped Today
          </p>

          <Truck size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">18</p>

        <p className="text-[10px] text-on-surface-variant">
          Via FedEx &amp; UPS
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-on-surface-variant">
            Total Revenue
          </p>

          <CircleDollarSign size={17} className="text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          RM24,502
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Last 30 days
        </p>
      </article>
    </section>
  );
}