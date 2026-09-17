import { CircleDot, Star, Users } from "lucide-react";

export default function CustomerMetrics() {
  return (
    <section className="grid grid-cols-2 gap-3">
      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">
            Total Customers
          </p>
          <span className="rounded-full bg-primary-container/40 px-1.5 py-0.5 text-[10px] font-bold text-on-primary-container">
            +14%
          </span>
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          3,428
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Lifetime registered
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
          2,180
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
          <span className="rounded-full bg-primary-container/40 px-1.5 py-0.5 text-[10px] font-bold text-on-primary-container">
            +8%
          </span>
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">
          184
        </p>

        <p className="text-[10px] text-on-surface-variant">
          Joined this month
        </p>
      </article>

      <article className="space-y-1 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">
            VIP / Returning
          </p>
          <Star size={17} className="fill-primary text-primary" />
        </div>

        <p className="font-display text-2xl font-bold text-on-surface">642</p>

        <p className="text-[10px] text-on-surface-variant">
          High-value tier
        </p>
      </article>
    </section>
  );
}