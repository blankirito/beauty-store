import { CalendarDays } from "lucide-react";

export default function DashboardIntro() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Atelier Dashboard
        </p>

        <h1 className="mt-1 font-display text-3xl text-on-surface">
          Overview
        </h1>
      </div>

      <p className="leading-relaxed text-on-surface-variant">
        A live overview of your boutique&apos;s orders, sales, and best-selling
        products.
      </p>

      <div className="flex h-10 w-fit items-center gap-2 rounded-full bg-primary-container/40 px-3 text-xs font-semibold uppercase tracking-wide text-on-primary-container">
        <CalendarDays size={16} />
        All-time store data
      </div>
    </section>
  );
}