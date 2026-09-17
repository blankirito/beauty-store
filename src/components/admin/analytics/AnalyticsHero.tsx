import { Download } from "lucide-react";

export default function AnalyticsHero() {
  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Business Intelligence
          </p>

          <h1 className="mt-1 font-display text-3xl text-on-surface">
            Analytics
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-on-surface-variant">
            Track your boutique’s performance, customer behaviour, and sales
            growth.
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90"
        >
          <Download size={17} />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>
    </section>
  );
}