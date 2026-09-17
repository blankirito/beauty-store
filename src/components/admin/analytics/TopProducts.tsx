import { ArrowUpRight } from "lucide-react";

const topProducts = [
  {
    name: "Radiance Renewal Serum",
    category: "Skincare",
    sales: "RM8,420",
    units: "182 sold",
  },
  {
    name: "Velvet Matte Lip Set",
    category: "Makeup",
    sales: "RM6,780",
    units: "156 sold",
  },
  {
    name: "Botanical Repair Shampoo",
    category: "Hair Care",
    sales: "RM5,960",
    units: "149 sold",
  },
  {
    name: "Silk Body Lotion",
    category: "Body Care",
    sales: "RM4,830",
    units: "128 sold",
  },
];

export default function TopProducts() {
  return (
    <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Best Sellers
          </p>

          <h2 className="mt-1 font-display text-2xl text-on-surface">
            Top Products
          </h2>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-primary"
        >
          View all
          <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {topProducts.map((product, index) => (
          <article
            key={product.name}
            className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-sm font-semibold text-on-primary-container">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-on-surface">
                {product.name}
              </p>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {product.category} · {product.units}
              </p>
            </div>

            <p className="shrink-0 font-display text-lg font-semibold text-on-surface">
              {product.sales}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}