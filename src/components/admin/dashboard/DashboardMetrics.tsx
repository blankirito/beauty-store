import { Boxes, ShoppingBag, TrendingUp, WalletCards } from "lucide-react";

export default function DashboardMetrics() {
  return (
    <section className="grid gap-3.5">
      <article className="rounded-xl bg-surface-container-low p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary">
              <WalletCards size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Total Sales
              </p>
              <p className="font-display text-2xl font-semibold text-on-surface">
                RM24,562.00
              </p>
            </div>
          </div>

          <span className="flex items-center gap-0.5 rounded-full bg-primary-container px-2 py-1 text-xs font-semibold text-on-primary-container">
            <TrendingUp size={14} />
            +12.5%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-surface-container">
          <div className="h-full w-[78%] rounded-full bg-primary" />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Target: RM30,000</span>
          <span className="font-medium text-primary">78% achieved</span>
        </div>
      </article>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-xl bg-surface-container-low p-3.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
              <ShoppingBag size={18} />
            </div>

            <span className="rounded-full bg-secondary-container px-1.5 py-0.5 text-xs font-semibold text-on-secondary-container">
              +8.2%
            </span>
          </div>

          <p className="text-xs text-on-surface-variant">Orders</p>
          <p className="font-display text-2xl font-semibold text-on-surface">
            1,284
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container">
            <div className="h-full w-[64%] rounded-full bg-secondary" />
          </div>
        </article>

        <article className="rounded-xl bg-surface-container-low p-3.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary">
              <Boxes size={18} />
            </div>

            <span className="rounded-full bg-surface-container px-1.5 py-0.5 text-xs font-semibold text-on-surface-variant">
              Stable
            </span>
          </div>

          <p className="text-xs text-on-surface-variant">Active SKUs</p>
          <p className="font-display text-2xl font-semibold text-on-surface">
            432
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container">
            <div className="h-full w-[92%] rounded-full bg-tertiary" />
          </div>
        </article>
      </div>
    </section>
  );
}