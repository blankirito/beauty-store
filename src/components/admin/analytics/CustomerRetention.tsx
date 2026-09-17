import { Sparkles, UserRoundCheck } from "lucide-react";

export default function CustomerRetention() {
  return (
    <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Customer Insights
        </p>

        <h2 className="mt-1 font-display text-2xl text-on-surface">
          Customer Retention
        </h2>
      </div>

      <div className="mt-5 rounded-xl bg-surface-container-lowest p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-on-surface">
              Returning customers
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Customers who have purchased before
            </p>
          </div>

          <p className="font-display text-3xl font-semibold text-primary">68%</p>
        </div>

        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-surface-container">
          <div className="h-full w-[68%] rounded-full bg-primary" />
          <div className="h-full w-[32%] bg-secondary-container" />
        </div>

        <div className="mt-3 flex justify-between text-xs text-on-surface-variant">
          <span>Returning: 68%</span>
          <span>New: 32%</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <article className="rounded-xl bg-surface-container-lowest p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container text-primary">
            <UserRoundCheck size={18} />
          </div>

          <p className="mt-3 text-xs text-on-surface-variant">Returning VIPs</p>
          <p className="mt-1 font-display text-2xl font-semibold text-on-surface">
            286
          </p>
        </article>

        <article className="rounded-xl bg-surface-container-lowest p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-container text-secondary">
            <Sparkles size={18} />
          </div>

          <p className="mt-3 text-xs text-on-surface-variant">First-time buyers</p>
          <p className="mt-1 font-display text-2xl font-semibold text-on-surface">
            452
          </p>
        </article>
      </div>
    </section>
  );
}