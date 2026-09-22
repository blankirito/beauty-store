"use client";

import type { AdminProduct } from "@/lib/products/adminProduct";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";
import { toDisplayProductStatus } from "@/lib/products/productStatus";
import {
  ArrowLeft,
  Check,
  Copy,
  ImagePlus,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useRouter } from "next/navigation";
import { archiveProduct } from "@/app/admin/products/[id]/actions";
import { getInitialProductImagePath } from "@/lib/products/productImageSelection";

type ProductDetailClientProps = {
  product: AdminProduct;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const router = useRouter();
  const imageUrls = supabaseUrl
    ? product.imagePaths.map((imagePath) =>
        getPublicProductImageUrl(supabaseUrl, imagePath),
      )
    : [];

  const initialImagePath = getInitialProductImagePath(
    product.imagePaths,
    product.primaryImagePath,
  );

  const initialImageUrl =
    initialImagePath && supabaseUrl
      ? getPublicProductImageUrl(supabaseUrl, initialImagePath)
      : null;

  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImageUrl,
  );
  const [isSkuCopied, setIsSkuCopied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState("");

  const isActive = product.status === "active";
  const isLowStock = product.stock <= product.lowStockThreshold;
  const statusLabel = toDisplayProductStatus(product.status);

  async function handleCopySku() {
    await navigator.clipboard.writeText(product.sku);
    setIsSkuCopied(true);

    window.setTimeout(() => {
      setIsSkuCopied(false);
    }, 1800);
  }

  async function handleArchive() {
    setIsArchiving(true);
    setArchiveError("");

    try {
      const result = await archiveProduct(product.id);

      if ("error" in result) {
        setArchiveError(result.error);
        setIsArchiving(false);
        return;
      }

      router.replace("/admin/products");
      router.refresh();
    } catch {
      setArchiveError(
        "We could not archive this product. Please try again.",
      );
      setIsArchiving(false);
    }
  }

  return (
    <main className="min-h-screen space-y-5 bg-surface px-5 py-6 pb-28">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
        >
          <ArrowLeft size={17} />
          Products
        </Link>

        <span className="text-xs text-on-surface-variant">
          Catalog / {product.category}
        </span>
      </div>

      <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
        <div className="relative overflow-hidden rounded-xl bg-surface-container">
          <div className="flex aspect-[4/3] items-center justify-center text-primary">
            <Package size={42} />
          </div>

          {selectedImage ? (
            <img
              src={selectedImage}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.classList.add("hidden");
              }}
              className="absolute inset-0 aspect-[4/3] w-full object-cover"
            />
          ) : null}
        </div>

        {imageUrls.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {imageUrls.map((imageUrl, index) => {
              const isSelected = imageUrl === selectedImage;

              return (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setSelectedImage(imageUrl)}
                  aria-label={`View product image ${index + 1}`}
                  className={
                    isSelected
                      ? "overflow-hidden rounded-xl border-2 border-primary bg-surface-container"
                      : "overflow-hidden rounded-xl border border-outline/25 bg-surface-container transition hover:border-primary"
                  }
                >
                  <img
                    src={imageUrl}
                    alt={`${product.name} view ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-5 border-t border-outline/20 pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-lg bg-surface-container px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {product.category}
            </span>

            <span
              className={
                isActive
                  ? "inline-flex items-center gap-1.5 rounded-full bg-primary-container px-2.5 py-1 text-xs font-semibold text-on-primary-container"
                  : "inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 text-xs font-semibold text-on-surface-variant"
              }
            >
              <span
                className={
                  isActive
                    ? "h-1.5 w-1.5 rounded-full bg-primary"
                    : "h-1.5 w-1.5 rounded-full bg-on-surface-variant"
                }
              />
              {statusLabel}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl text-on-surface">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">SKU:</span>

            <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs font-semibold text-on-surface">
              {product.sku}
            </code>

            <button
              type="button"
              onClick={handleCopySku}
              aria-label="Copy SKU"
              className="text-on-surface-variant transition hover:text-primary"
            >
              {isSkuCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            {isSkuCopied ? (
              <span className="text-xs font-medium text-primary">
                Copied
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-outline/20 pt-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Selling Price
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-on-surface">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <ImagePlus size={15} />
              {imageUrls.length} images
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline/20 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Inventory
            </p>
            <h2 className="mt-1 font-display text-2xl text-on-surface">
              Availability
            </h2>
          </div>

          <span
            className={
              isLowStock
                ? "rounded-full bg-error-container px-2.5 py-1 text-xs font-semibold text-on-error-container"
                : "rounded-full bg-primary-container px-2.5 py-1 text-xs font-semibold text-on-primary-container"
            }
          >
            {isLowStock ? "Low Stock" : "Healthy Level"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <article className="rounded-xl bg-surface-container-lowest p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container text-primary">
              <Package size={18} />
            </div>

            <p className="mt-3 text-xs text-on-surface-variant">
              Available Stock
            </p>

            <p className="mt-1 font-display text-3xl font-semibold text-on-surface">
              {product.stock}
              <span className="ml-1 text-xs font-sans font-medium text-on-surface-variant">
                units
              </span>
            </p>
          </article>

          <article className="rounded-xl bg-surface-container-lowest p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container text-primary">
              <Package size={18} />
            </div>

            <p className="mt-3 text-xs text-on-surface-variant">
              Low Stock Alert
            </p>

            <p className="mt-1 font-display text-3xl font-semibold text-on-surface">
              {product.lowStockThreshold}
              <span className="ml-1 text-xs font-sans font-medium text-on-surface-variant">
                units
              </span>
            </p>
          </article>
        </div>

        <p className="mt-3 text-xs text-on-surface-variant">
          {isLowStock
            ? `Restock recommended. Stock is at or below ${product.lowStockThreshold} units.`
            : `Restock alert will appear once stock reaches ${product.lowStockThreshold} units.`}
        </p>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Sales Performance
        </p>
        <h2 className="mt-1 font-display text-2xl text-on-surface">
          Sales data
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Sales performance will appear once order tracking is connected.
        </p>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
        <div className="border-b border-outline/20 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Product Information
          </p>
          <h2 className="mt-1 font-display text-2xl text-on-surface">
            Details & Specs
          </h2>
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Description
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-on-surface">
            {product.description}
          </p>
        </div>

        <div className="mt-5 border-t border-outline/20 pt-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            <div>
              <p className="text-xs text-on-surface-variant">Collection</p>
              <p className="mt-1 font-semibold text-on-surface">
                {product.collection ?? "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs text-on-surface-variant">Category</p>
              <p className="mt-1 font-semibold text-on-surface">
                {product.category}
              </p>
            </div>

            <div>
              <p className="text-xs text-on-surface-variant">Dimensions</p>
              <p className="mt-1 font-semibold text-on-surface">
                {product.dimensions ?? "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-xs text-on-surface-variant">Weight</p>
              <p className="mt-1 font-semibold text-on-surface">
                {product.weight ?? "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-outline/20 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Product Highlights
          </p>

          {product.features.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-on-surface"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-on-surface-variant">
              No product highlights provided.
            </p>
          )}
        </div>

        <div className="mt-5 space-y-2 border-t border-outline/20 pt-4 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-on-surface-variant">Created in catalog</span>
            <span className="font-medium text-on-surface">
              {formatDate(product.createdAt)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-on-surface-variant">Last updated</span>
            <span className="font-medium text-on-surface">
              {formatDate(product.updatedAt)}
            </span>
          </div>
        </div>
      </section>

      {archiveError ? (
        <p
          role="alert"
          className="rounded-xl bg-error-container px-3 py-2 text-sm text-error"
        >
          {archiveError}
        </p>
      ) : null}

      <aside className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline/20 bg-surface/95 px-5 py-3 backdrop-blur-xl lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            title="Archive product"
            aria-label="Archive product"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-error/20 bg-error-container text-error transition hover:opacity-80"
          >
            <Trash2 size={19} />
          </button>

          <Link
            href={`/admin/products/${product.id}/edit`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90"
          >
            <Pencil size={17} />
            Edit Product
          </Link>
        </div>
      </aside>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Archive product?"
        description={`Archive "${product.name}"? It will be hidden from the normal product list, but you can restore it later by editing its status.`}
        confirmLabel={isArchiving ? "Archiving..." : "Archive"}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleArchive}
      />
    </main>
  );
}