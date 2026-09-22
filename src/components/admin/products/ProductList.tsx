"use client";

import {
  Edit3,
  Package,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import type { AdminProduct } from "@/lib/products/adminProduct";
import { toDisplayProductStatus } from "@/lib/products/productStatus";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import { archiveProduct } from "@/app/admin/products/[id]/actions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

type ProductListProps = {
  items: AdminProduct[];
};

export default function ProductList({ items }: ProductListProps) {
  const router = useRouter();

  const [productToDelete, setProductToDelete] =
    useState<AdminProduct | null>(null);

  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState("");

  const productRows = items.slice(0, 5);

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

  async function handleArchive() {
    if (!productToDelete) {
      return;
    }

    setIsArchiving(true);
    setArchiveError("");

    try {
      const result = await archiveProduct(productToDelete.id);

      if ("error" in result) {
        setArchiveError(result.error);
        setIsArchiving(false);
        return;
      }

      setProductToDelete(null);
      router.refresh();
    } catch {
      setArchiveError(
        "We could not archive this product. Please try again.",
      );
      setIsArchiving(false);
    }
  }

  return (
    <section className="space-y-3">
      {productRows.map((product) => {
        const isLowStock =
          product.stock <= product.lowStockThreshold;
        const isActive = product.status === "active";
        const statusLabel = toDisplayProductStatus(product.status);

        const imageUrl =
          product.primaryImagePath && supabaseUrl
            ? getPublicProductImageUrl(
                supabaseUrl,
                product.primaryImagePath,
              )
            : null;

        function openProductDetail() {
          router.push(`/admin/products/${product.id}`);
        }

        return (
          <article
            key={product.id}
            role="link"
            tabIndex={0}
            onClick={openProductDetail}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProductDetail();
              }
            }}
            className="flex cursor-pointer flex-col space-y-3 rounded-2xl border border-outline/15 bg-surface-container-lowest p-3.5 shadow-sm transition hover:border-primary/35 hover:bg-surface-container-low"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-outline/15 bg-surface-container text-primary">
                  <Package size={22} />

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${product.name} product image`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.classList.add("hidden");
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 space-y-1">
                  <h3 className="truncate text-sm font-semibold text-on-surface">
                    {product.name}
                  </h3>

                  <p className="text-xs text-on-surface-variant">
                    SKU: {product.sku}
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
                    isActive
                      ? "inline-block rounded-full bg-primary-container/40 px-2 py-0.5 text-[10px] font-medium text-on-primary-container"
                      : "inline-block rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-medium text-on-surface-variant"
                  }
                >
                  {statusLabel}
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
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(`/admin/products/${product.id}/edit`);
                  }}
                  aria-label={`Edit ${product.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-surface-container"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setProductToDelete(product);
                  }}
                  aria-label={`Archive ${product.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-error hover:bg-error-container"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {archiveError ? (
        <p
          role="alert"
          className="rounded-xl bg-error-container px-3 py-2 text-sm text-error"
        >
          {archiveError}
        </p>
      ) : null}

      <ConfirmationDialog
        isOpen={productToDelete !== null}
        title="Archive product?"
        description={
          productToDelete
            ? `Archive "${productToDelete.name}"? It will be hidden from the normal product list, but you can restore it later by editing its status.`
            : ""
        }
        confirmLabel={isArchiving ? "Archiving..." : "Archive"}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleArchive}
      />
    </section>
  );
}