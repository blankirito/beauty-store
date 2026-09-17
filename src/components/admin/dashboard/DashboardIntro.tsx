import { CalendarDays, ChevronDown, Share2 } from "lucide-react";

export default function DashboardIntro() {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Atelier Dashboard
          </p>

          <h1 className="mt-1 font-display text-3xl text-on-surface">
            Overview
          </h1>
        </div>

        <button
          type="button"
          aria-label="Export dashboard data"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-high"
        >
          <Share2 size={20} />
        </button>
      </div>

      <p className="leading-relaxed text-on-surface-variant">
        Welcome back, Alex. Here is what is unfolding with your boutique today.
      </p>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-full bg-surface-container px-3.5 text-sm text-on-surface shadow-sm"
        >
          <CalendarDays size={18} className="text-primary" />
          Last 30 Days
          <ChevronDown size={18} className="text-on-surface-variant" />
        </button>

        <div className="flex h-10 items-center gap-2 rounded-full bg-primary-container/40 px-3 text-xs font-semibold uppercase tracking-wide text-on-primary-container">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Live sync
        </div>
      </div>
    </section>
  );
}