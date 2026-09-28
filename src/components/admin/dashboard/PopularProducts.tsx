import type { getTopReportingProducts } from "@/lib/admin/adminReporting";
import { ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

type PopularProductsProps = {
  products: ReturnType<typeof getTopReportingProducts>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function PopularProducts({
  products,
}: PopularProductsProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Curation
          </p>
          <h2 className="font-display text-2xl text-on-surface">
            Popular Products
          </h2>
        </div>

        <Link
          href="/admin/analytics/products"
          className="flex h-9 items-center gap-1 rounded-full bg-surface-container px-3 text-xs font-semibold text-primary transition-colors hover:bg-surface-container-high"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-outline/10 bg-white p-4 text-sm text-on-surface-variant shadow-sm">
          No paid product sales yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {products.slice(0, 4).map((product) => (
            <article
              key={product.productId}
              className="flex items-center justify-between rounded-xl border border-outline/10 bg-white p-3 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrinrounded-2xl border border-outline/10 bg-whitek-0 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <Tag size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-medium text-on-surface">
                    {product.productName}
                  </h3>

                  <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                    {product.category} · {product.unitsSold} sold
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-3 text-right">
                <p className="text-sm font-semibold text-on-surface">
                  {formatCurrency(product.revenue)}
                </p>

                <p className="text-xs text-primary">Paid sales</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}