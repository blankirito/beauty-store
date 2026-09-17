import { Edit3, Trash2, TriangleAlert } from "lucide-react";
import type { Products } from "@/types/products";
import { getInventoryDetails } from "@/data/adminInventory";

type ProductListProps = {
  items: Products[];
};

export default function ProductList({ items }: ProductListProps) {
  const productRows = items.slice(0, 5).map((product) => ({
    ...product,
    ...getInventoryDetails(product.id),
  }));

  if (productRows.length === 0) {
    return (
      <section className="rounded-2xl border border-outline/15 bg-surface-container-lowest p-8 text-center shadow-sm">
        <p className="font-display text-xl text-on-surface">
          No products found
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Try searching for a different product name or category.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {productRows.map((product) => {
        const isLowStock = product.stock <= 5;
        const isDraft = product.status === "Draft";

        return (
          <article
            key={product.id}
            className="flex flex-col space-y-3 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-14 w-14 flex-shrink-0 rounded-xl border border-outline/15 bg-surface-container object-cover"
                />

                <div className="min-w-0 space-y-1">
                  <h3 className="truncate text-sm font-semibold text-on-surface">
                    {product.name}
                  </h3>

                  <p className="text-xs text-on-surface-variant">
                    SKU: LUM-{String(product.id).padStart(3, "0")}
                  </p>

                  <span className="inline-flex rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-1 text-right">
                <p className="text-sm font-semibold text-on-surface">
                  RM{product.price.toFixed(2)}
                </p>

                <span
                  className={
                    isDraft
                      ? "inline-block rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-medium text-on-surface-variant"
                      : "inline-block rounded-full bg-primary-container/40 px-2 py-0.5 text-[10px] font-medium text-on-primary-container"
                  }
                >
                  {product.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-outline/10 pt-2.5">
              {isLowStock ? (
                <div className="flex items-center gap-1.5 rounded-full bg-error-container px-2 py-1 text-xs font-medium text-error">
                  <TriangleAlert size={14} />
                  {product.stock} remaining · Low stock
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium text-on-surface">
                    {product.stock} units
                  </span>
                  in stock
                </div>
              )}

              <div className="flex gap-1.5">
                <button
                  type="button"
                  aria-label={`Edit ${product.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-container"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  type="button"
                  aria-label={`Delete ${product.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-error hover:bg-error-container"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}