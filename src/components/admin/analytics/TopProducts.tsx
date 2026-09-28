import type { getTopReportingProducts } from "@/lib/admin/adminReporting";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type TopProductsProps = {
  products: ReturnType<typeof getTopReportingProducts>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function TopProducts({
  products,
}: TopProductsProps) {
  return (
    <section className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Best Sellers
          </p>

          <h2 className="mt-1 font-display text-2xl text-on-surface">
            Top Products
          </h2>
        </div>

        <Link
          href="/admin/analytics/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:opacity-75"
        >
          View all
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
          No paid product sales are available yet.
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {products.slice(0, 4).map((product, index) => (
            <article
              key={product.productId}
              className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-sm font-semibold text-on-primary-container">
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-on-surface">
                  {product.productName}
                </p>
                <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                  {product.category} · {product.unitsSold} sold
                </p>
              </div>

              <p className="shrink-0 font-display text-lg font-semibold text-on-surface">
                {formatCurrency(product.revenue)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
