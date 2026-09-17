import { Plus } from "lucide-react";

export default function CustomersHero() {
  return (
    <section className="space-y-3.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Customer Management
          </p>

          <h1 className="font-display text-3xl font-semibold tracking-tight text-on-surface">
            Customers
          </h1>
        </div>

        <button
          type="button"
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-on-primary-container"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      <p className="text-sm leading-relaxed text-on-surface-variant">
        View customer profiles, track purchase history, and manage boutique
        relationships.
      </p>
    </section>
  );
}