import type { getReportingCategories } from "@/lib/admin/adminReporting";

type SalesByCategoryProps = {
  categories: ReturnType<typeof getReportingCategories>;
};

const categoryColors = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-primary-container",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function SalesByCategory({
  categories,
}: SalesByCategoryProps) {
  return (
    <section className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Product Mix
          </p>

          <h2 className="mt-1 font-display text-2xl text-on-surface">
            Sales by Category
          </h2>
        </div>

        <span className="text-xs text-on-surface-variant">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
          No paid category sales are available yet.
        </div>
      ) : (
        <>
          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-surface-container-lowest">
            {categories.map((category, index) => (
              <div
                key={category.category}
                className={categoryColors[index % categoryColors.length]}
                style={{ width: `${category.percentage}%` }}
                title={`${category.category}: ${category.percentage}%`}
              />
            ))}
          </div>

          <div className="mt-5 space-y-3.5">
            {categories.map((category, index) => {
              const color =
                categoryColors[index % categoryColors.length];

              return (
                <div
                  key={category.category}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className={`h-3 w-3 shrink-0 rounded-full ${color}`} />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-on-surface">
                        {category.category}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {formatCurrency(category.revenue)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-on-surface">
                    {category.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
