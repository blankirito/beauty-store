"use client";

import type { Products } from "@/types/products";
import type { AdminProductDetail } from "@/data/adminProductDetails";
import {
  ArrowLeft,
  BarChart3,
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

type ProductDetailClientProps = {
  product: Products;
  inventory: {
    stock: number;
    status: string;
  };
  detail: AdminProductDetail;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function ProductDetailClient({
  product,
  inventory,
  detail,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] ?? product.image);
  const [isSkuCopied, setIsSkuCopied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const sku = `LUM-${String(product.id).padStart(3, "0")}`;
  const isActive = inventory.status === "Active";
  const isLowStock = inventory.stock <= detail.lowStockThreshold;

  async function handleCopySku() {
    await navigator.clipboard.writeText(sku);
    setIsSkuCopied(true);

    window.setTimeout(() => {
      setIsSkuCopied(false);
    }, 1800);
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
        <div className="overflow-hidden rounded-xl bg-surface-container">
          <img
            src={selectedImage}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {product.images.map((image, index) => {
            const isSelected = image === selectedImage;

            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`View product image ${index + 1}`}
                className={
                  isSelected
                    ? "overflow-hidden rounded-xl border-2 border-primary bg-surface-container"
                    : "overflow-hidden rounded-xl border border-outline/25 bg-surface-container transition hover:border-primary"
                }
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </button>
            );
          })}
        </div>

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
              {inventory.status}
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl text-on-surface">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">SKU:</span>

            <code className="rounded bg-surface-container px-1.5 py-0.5 text-xs font-semibold text-on-surface">
              {sku}
            </code>

            <button
              type="button"
              onClick={handleCopySku}
              aria-label="Copy SKU"
              className="text-on-surface-variant transition hover:text-primary"
            >
              {isSkuCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            {isSkuCopied && (
              <span className="text-xs font-medium text-primary">Copied</span>
            )}
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
              {product.images.length} images
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
              {inventory.stock}
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
              {detail.lowStockThreshold}
              <span className="ml-1 text-xs font-sans font-medium text-on-surface-variant">
                units
              </span>
            </p>
          </article>
        </div>

        <p className="mt-3 text-xs text-on-surface-variant">
          {isLowStock
            ? `Restock recommended. Stock is at or below ${detail.lowStockThreshold} units.`
            : `Restock alert will appear once stock reaches ${detail.lowStockThreshold} units.`}
        </p>
      </section>

      <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline/20 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Sales Performance
            </p>
            <h2 className="mt-1 font-display text-2xl text-on-surface">
              30-Day Performance
            </h2>
          </div>

          <span className="text-xs text-on-surface-variant">Last 30 days</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <article className="rounded-xl bg-surface-container-lowest p-3">
            <BarChart3 size={18} className="text-primary" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Units Sold
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-on-surface">
              {detail.performance.unitsSold}
            </p>
          </article>

          <article className="rounded-xl bg-surface-container-lowest p-3">
            <BarChart3 size={18} className="text-primary" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Revenue
            </p>
            <p className="mt-1 font-display text-base font-semibold text-on-surface sm:text-xl">
              {formatCurrency(detail.performance.revenue)}
            </p>
          </article>

          <article className="rounded-xl bg-surface-container-lowest p-3">
            <BarChart3 size={18} className="text-primary" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Orders
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-on-surface">
              {detail.performance.orders}
            </p>
          </article>
        </div>
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
                {detail.collection}
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
                {detail.dimensions}
              </p>
            </div>

            <div>
              <p className="text-xs text-on-surface-variant">Weight</p>
              <p className="mt-1 font-semibold text-on-surface">
                {detail.weight}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-outline/20 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Product Highlights
          </p>

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
        </div>

        <div className="mt-5 space-y-2 border-t border-outline/20 pt-4 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-on-surface-variant">Created in catalog</span>
            <span className="font-medium text-on-surface">{detail.createdAt}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-on-surface-variant">Last updated</span>
            <span className="font-medium text-on-surface">{detail.updatedAt}</span>
          </div>
        </div>
      </section>

      <aside className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline/20 bg-surface/95 px-5 py-3 backdrop-blur-xl lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            title="Delete product"
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
        title="Delete product?"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          // UI stage only — real deletion comes with backend.
          setIsDeleteDialogOpen(false);
        }}
      />
    </main>
  );
}