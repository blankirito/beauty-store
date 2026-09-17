const categories = [
  {
    name: "Skincare",
    value: "RM20,282",
    percentage: 42,
    color: "bg-primary",
  },
  {
    name: "Makeup",
    value: "RM13,521",
    percentage: 28,
    color: "bg-secondary",
  },
  {
    name: "Hair Care",
    value: "RM8,692",
    percentage: 18,
    color: "bg-tertiary",
  },
  {
    name: "Body Care",
    value: "RM5,795",
    percentage: 12,
    color: "bg-primary-container",
  },
];

export default function SalesByCategory() {
  return (
    <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Product Mix
          </p>

          <h2 className="mt-1 font-display text-2xl text-on-surface">
            Sales by Category
          </h2>
        </div>

        <span className="text-xs text-on-surface-variant">4 main categories</span>
      </div>

      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-surface-container-lowest">
        {categories.map((category) => (
          <div
            key={category.name}
            className={category.color}
            style={{ width: `${category.percentage}%` }}
            title={`${category.name}: ${category.percentage}%`}
          />
        ))}
      </div>

      <div className="mt-5 space-y-3.5">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`h-3 w-3 rounded-full ${category.color}`} />

              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {category.name}
                </p>
                <p className="text-xs text-on-surface-variant">{category.value}</p>
              </div>
            </div>

            <span className="text-sm font-semibold text-on-surface">
              {category.percentage}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}