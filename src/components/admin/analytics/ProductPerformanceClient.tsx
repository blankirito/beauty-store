"use client";

import type { getTopReportingProducts } from "@/lib/admin/adminReporting";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ProductPerformanceClientProps = {
  products: ReturnType<typeof getTopReportingProducts>;
};

type SortBy = "revenue" | "units";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function ProductPerformanceClient({
  products,
}: ProductPerformanceClientProps) {
  const [sortBy, setSortBy] = useState<SortBy>("revenue");

  const rankedProducts = useMemo(
    () =>
      [...products].sort((first, second) =>
        sortBy === "revenue"
          ? second.revenue - first.revenue
          : second.unitsSold - first.unitsSold,
      ),
    [products, sortBy],
  );

  const totalRevenue = products.reduce(
    (total, product) => total + product.revenue,
    0,
  );

  const totalUnits = products.reduce(
    (total, product) => total + product.unitsSold,
    0,
  );

  return (
    <main className="min-h-screen bg-surface px-5 py-6 pb-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
        >
          <ArrowLeft size={17} />
          Analytics
        </Link>

        <section className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Product Analytics
          </p>

          <h1 className="mt-1 font-display text-3xl text-on-surface">
            Product Performance
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Compare paid sales performance across your boutique catalog.
          </p>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/35 text-primary">
              <WalletCards size={20} />
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
              Product Revenue
            </p>

            <p className="mt-1 font-display text-3xl text-on-surface">
              {formatCurrency(totalRevenue)}
            </p>

            <p className="mt-1 text-xs text-on-surface-variant">
              Across all paid product sales
            </p>
          </article>

          <article className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
              <Package size={20} />
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
              Units Sold
            </p>

            <p className="mt-1 font-display text-3xl text-on-surface">
              {totalUnits.toLocaleString("en-MY")}
            </p>

            <p className="mt-1 text-xs text-on-surface-variant">
              Total items sold in paid orders
            </p>
          </article>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Ranking
              </p>

              <h2 className="mt-1 font-display text-2xl text-on-surface">
                Top Products
              </h2>
            </div>

            <div className="flex rounded-xl bg-surface-container p-1">
              <button
                type="button"
                onClick={() => setSortBy("revenue")}
                className={
                  sortBy === "revenue"
                    ? "rounded-lg bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-primary shadow-sm"
                    : "rounded-lg px-3 py-1.5 text-xs font-semibold text-on-surface-variant"
                }
              >
                Revenue
              </button>

              <button
                type="button"
                onClick={() => setSortBy("units")}
                className={
                  sortBy === "units"
                    ? "rounded-lg bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-primary shadow-sm"
                    : "rounded-lg px-3 py-1.5 text-xs font-semibold text-on-surface-variant"
                }
              >
                Units
              </button>
            </div>
          </div>

          {rankedProducts.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-outline/10 bg-white p-5 text-sm text-on-surface-variant shadow-sm">
              No paid product sales are available yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {rankedProducts.map((product, index) => (
                <Link
                  key={product.productId}
                  href={`/admin/products/${product.productId}`}
                  className="group flex items-center gap-3 rounded-2xl border border-outline/10 bg-white p-3.5 shadow-sm transition hover:border-primary/30 hover:bg-surface-container-low"
                >
                  <span className="w-5 text-center text-sm font-bold text-primary">
                    {index + 1}
                  </span>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-outline/15 bg-surface-container text-primary">
                    <Package size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-on-surface">
                      {product.productName}
                    </h3>

                    <p className="mt-1 truncate text-xs text-on-surface-variant">
                      {product.category} · {product.unitsSold} units sold
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-right">
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {formatCurrency(product.revenue)}
                      </p>

                      <p className="mt-1 text-[11px] text-on-surface-variant">
                        View product
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-on-surface-variant transition group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
