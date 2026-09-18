"use client";

import { getProductPerformance } from "@/data/adminProductPerformance";
import { products } from "@/data/products";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Package,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type SortBy = "revenue" | "units";

const timeRanges = ["7 Days", "30 Days", "90 Days", "This Year"];

function formatCurrency(value: number) {
  return `RM${value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function ProductPerformanceClient() {
  const [selectedRange, setSelectedRange] = useState("30 Days");
  const [sortBy, setSortBy] = useState<SortBy>("revenue");

  const rankedProducts = useMemo(() => {
    return products
      .map((product) => ({
        ...product,
        ...getProductPerformance(product.id),
      }))
      .sort((first, second) =>
        sortBy === "revenue"
          ? second.revenue - first.revenue
          : second.unitsSold - first.unitsSold,
      );
  }, [sortBy]);

  const totalRevenue = rankedProducts.reduce(
    (total, product) => total + product.revenue,
    0,
  );

  const totalUnits = rankedProducts.reduce(
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
            Compare sales performance across your boutique catalog and identify
            the products driving revenue.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <CalendarDays
              size={18}
              className="ml-1 flex-shrink-0 text-primary"
            />

            {timeRanges.map((range) => {
              const isSelected = selectedRange === range;

              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => setSelectedRange(range)}
                  className={
                    isSelected
                      ? "whitespace-nowrap rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-on-primary"
                      : "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container"
                  }
                >
                  {range}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/35 text-primary">
                <WalletCards size={20} />
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/35 px-2 py-1 text-xs font-semibold text-on-primary-container">
                <TrendingUp size={13} />
                +12.8%
              </span>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
              Product Revenue
            </p>

            <p className="mt-1 font-display text-3xl text-on-surface">
              {formatCurrency(totalRevenue)}
            </p>

            <p className="mt-1 text-xs text-on-surface-variant">
              Across all products · {selectedRange}
            </p>
          </article>

          <article className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-4 shadow-sm">
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
              Total catalog items sold · {selectedRange}
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

          <div className="mt-4 space-y-3">
            {rankedProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm transition hover:border-primary/30 hover:bg-surface-container-low"
              >
                <span className="w-5 text-center text-sm font-bold text-primary">
                  {index + 1}
                </span>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl border border-outline/15 bg-surface-container object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-on-surface">
                      {product.name}
                    </h3>

                    <span className="rounded-full bg-primary-container/35 px-2 py-0.5 text-[10px] font-semibold text-on-primary-container">
                      +{product.changePercent}%
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-on-surface-variant">
                    LUM-{String(product.id).padStart(3, "0")} ·{" "}
                    {product.category}
                  </p>

                  <p className="mt-1 text-xs text-on-surface-variant">
                    {product.unitsSold} units sold
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
        </section>
      </div>
    </main>
  );
}