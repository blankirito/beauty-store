import { CalendarDays, ChevronDown } from "lucide-react";

const ranges = ["7 Days", "30 Days", "3 Months", "1 Year"];

export default function AnalyticsTimeframe() {
  return (
    <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
        <CalendarDays size={18} className="text-primary" />
        Timeframe
      </div>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-between rounded-xl bg-surface-container-lowest px-3.5 py-3 text-sm text-on-surface shadow-sm"
      >
        <span>October 1 – October 31, 2025</span>
        <ChevronDown size={17} className="text-on-surface-variant" />
      </button>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {ranges.map((range) => {
          const isActive = range === "30 Days";

          return (
            <button
              key={range}
              type="button"
              className={
                isActive
                  ? "rounded-xl bg-primary px-2 py-2.5 text-xs font-semibold text-on-primary"
                  : "rounded-xl bg-surface-container-lowest px-2 py-2.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container"
              }
            >
              {range}
            </button>
          );
        })}
      </div>
    </section>
  );
}