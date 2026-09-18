"use client";

import { useMemo, useState } from "react";
import type { Products } from "@/types/products";
import CategoryHeader from "./CategoryHeader";
import CategoryFilter from "./CategoryFilter";
import CategoryProductGrid from "./CategoryProductGrid";

type CategoryClientProps = {
  category: string;
  products: Products[];
};

const filters = ["All", "Hydration", "Anti-aging", "Brightening"] as const;

export default function CategoryClient({
  category,
  products,
}: CategoryClientProps) {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") {
      return products;
    }

    const normalizedFilter = activeFilter
      .toLowerCase()
      .replace("-", " ");

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.description,
        ...product.features,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedFilter);
    });
  }, [activeFilter, products]);

  return (
    <>
      <CategoryHeader category={category} count={filteredProducts.length} />

      <CategoryFilter
        filters={filters}
        activeFilter={activeFilter}
        onChange={(filter) =>
            setActiveFilter(filter as (typeof filters)[number])
        }
        />

      {filteredProducts.length > 0 ? (
        <CategoryProductGrid products={filteredProducts} />
      ) : (
        <section className="mt-8 px-5 text-center">
          <div className="rounded-2xl bg-surface-low p-8">
            <h2 className="font-display text-2xl text-primary">
              No products found
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Try another filter to explore this collection.
            </p>
          </div>
        </section>
      )}
    </>
  );
}