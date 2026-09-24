"use client";

import type { AdminProduct } from "@/lib/products/adminProduct";
import { updateProduct } from "@/app/admin/products/[id]/edit/actions";
import type { NewProductFormValues } from "@/lib/products/newProduct";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ImagePlus,
  Minus,
  Plus,
  Save,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { ProductStatusLabel } from "@/lib/products/productStatus";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/admin/products/new/actions";
import { uploadProductImages } from "@/lib/products/uploadProductImages";
import { syncProductImages } from "@/app/admin/products/[id]/edit/imageActions";
import { getPublicProductImageUrl } from "@/lib/products/productImageUrl";

type ProductFormProps = {
  mode: "create" | "edit";
  product?: AdminProduct;
  backHref: string;
};

const categories = ["Skincare", "Hair", "Makeup", "body-care", "Beauty"];
const statuses: ProductStatusLabel[] = [
  "Active",
  "Draft",
  "Archived",
];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function ProductForm({
  mode,
  product,
  backHref,
}: ProductFormProps) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<NewProductFormValues>({
    name: product?.name ?? "",
    category: product?.category ?? "Skincare",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "0",
    lowStockThreshold: product
      ? String(product.lowStockThreshold)
      : "10",
    collection: product?.collection ?? "",
    dimensions: product?.dimensions ?? "",
    weight: product?.weight ?? "",
    status: product
      ? product.status === "active"
        ? "Active"
        : product.status === "draft"
          ? "Draft"
          : "Archived"
      : "Active",
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  type ProductImagePreview = {
    file?: File;
    previewUrl: string;
    storagePath?: string;
  };

  const [images, setImages] = useState<ProductImagePreview[]>(
    product?.imagePaths.map((storagePath) => ({
      storagePath,
      previewUrl: supabaseUrl
        ? getPublicProductImageUrl(supabaseUrl, storagePath)
        : storagePath,
    })) ?? [],
  );

  const [primaryImageIndex, setPrimaryImageIndex] = useState(
    product?.primaryImagePath
      ? Math.max(
        0,
        product.imagePaths.indexOf(product.primaryImagePath),
      )
      : 0,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function adjustNumber(
    field: "stock" | "lowStockThreshold",
    amount: number,
  ) {
    setForm((current) => {
      const currentValue = Number(current[field]) || 0;

      return {
        ...current,
        [field]: String(Math.max(0, currentValue + amount)),
      };
    });
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    const availableSlots = 5 - images.length;

    const newImages = selectedFiles.slice(0, availableSlots).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((currentImages) => [
      ...currentImages,
      ...newImages,
    ]);

    event.target.value = "";
  }

  function removeImage(index: number) {
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );

    setPrimaryImageIndex((currentIndex) => {
      if (index < currentIndex) return currentIndex - 1;
      if (index === currentIndex) return 0;
      return currentIndex;
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isEdit) {
      if (!product) {
        setSubmitError("We could not find this product.");
        return;
      }

      setIsSaving(true);
      setSubmitError("");

      try {
        const updateResult = await updateProduct(product.id, form);

        if ("error" in updateResult) {
          setSubmitError(updateResult.error);
          setIsSaving(false);
          return;
        }

        const existingImagePaths = images.flatMap((image) =>
          image.storagePath ? [image.storagePath] : [],
        );

        const selectedPrimaryImage = images[primaryImageIndex];

        const primaryExistingImagePath =
          selectedPrimaryImage?.storagePath ??
          existingImagePaths[0] ??
          null;

        const initialSyncResult = await syncProductImages({
          productId: product.id,
          desiredImagePaths: existingImagePaths,
          primaryImagePath: primaryExistingImagePath,
        });

        if ("error" in initialSyncResult) {
          setSubmitError(initialSyncResult.error);
          setIsSaving(false);
          return;
        }

        const newImageFiles = images
          .map((image) => image.file)
          .filter((file): file is File => Boolean(file));

        let newImagePaths: string[] = [];

        if (newImageFiles.length > 0) {
          const uploadResult = await uploadProductImages({
            storeId: updateResult.storeId,
            productId: product.id,
            files: newImageFiles,
            primaryImageIndex: Math.max(
              0,
              primaryImageIndex - existingImagePaths.length,
            ),
            existingImageCount: existingImagePaths.length,
          });

          if (uploadResult.error) {
            setSubmitError(uploadResult.error);
            setIsSaving(false);
            return;
          }

          newImagePaths = uploadResult.storagePaths ?? [];
        }

        const desiredImagePaths = [
          ...existingImagePaths,
          ...newImagePaths,
        ];

        const finalSyncResult = await syncProductImages({
          productId: product.id,
          desiredImagePaths,
          primaryImagePath:
            desiredImagePaths[primaryImageIndex] ?? null,
        });

        if ("error" in finalSyncResult) {
          setSubmitError(finalSyncResult.error);
          setIsSaving(false);
          return;
        }

        router.replace(`/admin/products/${updateResult.productId}`);
        router.refresh();
        return;
      } catch {
        setSubmitError(
          "We could not update this product. Please try again.",
        );
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(true);
    setSubmitError("");

    try {
      const result = await createProduct(form);

      if ("error" in result) {
        setSubmitError(result.error);
        setIsSaving(false);
        return;
      }

      const imageFiles = images
        .map((image) => image.file)
        .filter((file): file is File => Boolean(file));

      if (imageFiles.length > 0) {
        const uploadResult = await uploadProductImages({
          storeId: result.storeId,
          productId: result.productId,
          files: imageFiles,
          primaryImageIndex,
        });

        if (uploadResult.error) {
          setSubmitError(uploadResult.error);
          setIsSaving(false);
          return;
        }
      }

      router.replace("/admin/products");
      router.refresh();
    } catch {
      setSubmitError(
        "We could not add this product. Please try again.",
      );
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface px-5 py-6 pb-28">
      <div className="mx-auto max-w-3xl">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
        >
          <ArrowLeft size={17} />
          {isEdit ? "Product Details" : "Products"}
        </Link>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Product Management
          </p>

          <h1 className="mt-1 font-display text-3xl text-on-surface">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {isEdit
              ? "Update the catalog details, pricing, and inventory for this product."
              : "Add a new product to your Lumina storefront catalog."}
          </p>
        </div>

        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Product Images
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Up to 5 images · Choose one primary display image
                </p>
              </div>

              <span className="rounded-full bg-surface-container px-2.5 py-1 text-xs font-semibold text-primary">
                {images.length} / 5
              </span>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="mt-4 flex w-full flex-col items-center rounded-xl border-2 border-dashed border-outline/30 bg-surface-container-lowest px-4 py-5 text-center transition hover:border-primary hover:bg-surface-container"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary">
                <ImagePlus size={20} />
              </span>

              <span className="mt-2 text-sm font-semibold text-on-surface">
                Tap to upload photos
              </span>

              <span className="mt-1 text-xs text-on-surface-variant">
                PNG, JPG, or WebP · Up to 5 images
              </span>
            </button>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {images.map((image, index) => {
                  const isPrimary = index === primaryImageIndex;

                  return (
                    <div
                      key={image.previewUrl}
                      className={
                        isPrimary
                          ? "relative aspect-square overflow-hidden rounded-xl border-2 border-primary bg-surface-container"
                          : "relative aspect-square overflow-hidden rounded-xl border border-outline/25 bg-surface-container"
                      }
                    >
                      <img
                        src={image.previewUrl}
                        alt={`Product preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {isPrimary ? (
                        <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-on-primary">
                          <Star size={10} fill="currentColor" />
                          Primary
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimaryImageIndex(index)}
                          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-md bg-surface/95 px-1.5 py-1 text-[9px] font-semibold text-on-surface shadow-sm transition hover:bg-primary hover:text-on-primary"
                        >
                          Make Primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface/90 text-on-surface shadow-sm transition hover:bg-error-container hover:text-error"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline/30 bg-surface-container-lowest text-on-surface-variant transition hover:border-primary hover:text-primary"
                  >
                    <Plus size={22} />
                    <span className="mt-1 text-[10px] font-semibold">
                      Add Visual
                    </span>
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Basic Information
            </p>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Product Name
                </span>

                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Glow Serum"
                  className="mt-2 w-full rounded-xl border border-outline/25 bg-surface-container-lowest px-3.5 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <div>
                <div className="relative">
                  <span className="text-sm font-semibold text-on-surface">
                    Category
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen((current) => !current)}
                    className="mt-2 flex w-full items-center justify-between rounded-xl border border-outline/25 bg-surface-container-lowest px-3.5 py-3 text-left text-sm text-on-surface outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/15"
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryOpen}
                  >
                    <span>{form.category}</span>

                    <ChevronDown
                      size={18}
                      className={`text-primary transition ${isCategoryOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {isCategoryOpen && (
                    <>
                      <button
                        type="button"
                        aria-label="Close category menu"
                        onClick={() => setIsCategoryOpen(false)}
                        className="fixed inset-0 z-10 cursor-default"
                      />

                      <div
                        role="listbox"
                        aria-label="Product category"
                        className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-outline/20 bg-surface p-1.5 shadow-lg"
                      >
                        {categories.map((category) => {
                          const isSelected = form.category === category;

                          return (
                            <button
                              key={category}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                updateField("category", category);
                                setIsCategoryOpen(false);
                              }}
                              className={
                                isSelected
                                  ? "flex w-full items-center justify-between rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white"
                                  : "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-on-surface transition hover:bg-surface-low"
                              }
                            >
                              {category}
                              {isSelected && <Check size={17} />}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Description
                </span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={4}
                  placeholder="Describe the product for customers."
                  className="mt-2 w-full resize-none rounded-xl border border-outline/25 bg-surface-container-lowest px-3.5 py-3 text-sm leading-relaxed text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Pricing
            </p>

            <p className="mt-1 text-xs text-on-surface-variant">
              Customer-facing price shown in the storefront.
            </p>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-on-surface">
                Selling Price (RM)
              </span>

              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-display text-lg font-semibold text-on-surface-variant">
                  RM
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-outline/25 bg-surface-container-lowest py-3 pl-11 pr-3.5 text-lg font-semibold text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </label>
          </section>

          <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Inventory
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Initial stock levels and notification limits.
                </p>
              </div>

              <span className="rounded-full bg-primary-container px-2.5 py-1 text-xs font-semibold text-on-primary-container">
                Tracked
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-outline/20 bg-surface-container-lowest p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Stock Units
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => adjustNumber("stock", -1)}
                    aria-label="Decrease stock"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline/20 bg-surface text-on-surface transition hover:bg-surface-container"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => updateField("stock", event.target.value)}
                    className="w-12 bg-transparent text-center font-display text-xl font-semibold text-on-surface outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => adjustNumber("stock", 1)}
                    aria-label="Increase stock"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline/20 bg-surface text-on-surface transition hover:bg-surface-container"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="mt-2 text-center text-[10px] font-medium text-primary">
                  Ready for dispatch
                </p>
              </div>

              <div className="rounded-xl border border-outline/20 bg-surface-container-lowest p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Alert Level
                </p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => adjustNumber("lowStockThreshold", -1)}
                    aria-label="Decrease alert level"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline/20 bg-surface text-on-surface transition hover:bg-surface-container"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={form.lowStockThreshold}
                    onChange={(event) =>
                      updateField("lowStockThreshold", event.target.value)
                    }
                    className="w-12 bg-transparent text-center font-display text-xl font-semibold text-on-surface outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => adjustNumber("lowStockThreshold", 1)}
                    aria-label="Increase alert level"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline/20 bg-surface text-on-surface transition hover:bg-surface-container"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="mt-2 text-center text-[10px] text-on-surface-variant">
                  Restock reminder
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-on-surface-variant">
              Alert triggers automatically once inventory reaches this threshold.
            </p>
          </section>

          <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Publishing Status
            </p>

            <p className="mt-1 text-xs text-on-surface-variant">
              Control visibility on the Lumina storefront.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {statuses.map((status) => {
                const isSelected = form.status === status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateField("status", status)}
                    className={
                      isSelected
                        ? "rounded-xl border-2 border-primary bg-surface-container p-2.5 text-center"
                        : "rounded-xl border border-outline/25 bg-surface-container-lowest p-2.5 text-center transition hover:bg-surface-container"
                    }
                  >
                    <span className="flex items-center justify-center gap-1 text-xs font-semibold text-on-surface">
                      <span
                        className={
                          status === "Active"
                            ? "h-2 w-2 rounded-full bg-primary"
                            : status === "Draft"
                              ? "h-2 w-2 rounded-full bg-secondary"
                              : "h-2 w-2 rounded-full bg-outline"
                        }
                      />
                      {status}
                    </span>

                    <span className="mt-1 block text-[9px] text-on-surface-variant">
                      {status === "Active"
                        ? "Live in store"
                        : status === "Draft"
                          ? "Hidden"
                          : "Archived"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Optional Product Details
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-on-surface">
                  Collection
                </span>

                <input
                  value={form.collection}
                  onChange={(event) =>
                    updateField("collection", event.target.value)
                  }
                  placeholder="e.g. Radiance Essentials"
                  className="mt-2 w-full rounded-xl border border-outline/25 bg-surface-container-lowest px-3.5 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Dimensions
                </span>

                <input
                  value={form.dimensions}
                  onChange={(event) =>
                    updateField("dimensions", event.target.value)
                  }
                  placeholder="e.g. 30 ml bottle"
                  className="mt-2 w-full rounded-xl border border-outline/25 bg-surface-container-lowest px-3.5 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-on-surface">
                  Weight
                </span>

                <input
                  value={form.weight}
                  onChange={(event) => updateField("weight", event.target.value)}
                  placeholder="e.g. 120 g"
                  className="mt-2 w-full rounded-xl border border-outline/25 bg-surface-container-lowest px-3.5 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
            </div>
          </section>
          {submitError && (
            <p
              role="alert"
              className="rounded-xl bg-error-container px-3 py-2 text-sm text-error"
            >
              {submitError}
            </p>
          )}
        </form>
      </div>

      <aside className="fixed bottom-0 left-0 right-0 z-30 border-t border-outline/20 bg-surface/95 px-5 py-3 backdrop-blur-xl lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            href={backHref}
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-outline/25 bg-surface-container-lowest text-sm font-semibold text-on-surface transition hover:bg-surface-container"
          >
            Cancel
          </Link>

          <button
            form="product-form"
            type="submit"
            disabled={isSaving}
            className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={17} />
            {isEdit
              ? "Save Changes"
              : isSaving
                ? "Adding Product..."
                : "Add Product"}
          </button>
        </div>
      </aside>
    </main>
  );
}