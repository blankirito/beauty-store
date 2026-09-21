"use client";

import {
  ArrowDownUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { ProductStatusLabel } from "@/lib/products/productStatus";

type StatusFilter = "All" | ProductStatusLabel;

type ProductFiltersProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  totalProducts: number;
};

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  totalProducts,
}: ProductFiltersProps) {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const productsPerPage = 5;
  const displayedProducts = Math.min(totalProducts, productsPerPage);

  const categoryOptions = ["All Categories", ...categories];
  const statusOptions: StatusFilter[] = [
    "All",
    "Active",
    "Draft",
    "Archived",
  ];

  function selectCategory(category: string) {
    onCategoryChange(category);
    setIsCategoryMenuOpen(false);
  }

  function selectStatus(status: StatusFilter) {
    onStatusChange(status);
    setIsStatusMenuOpen(false);
  }

  return (
    <section className="space-y-3 pt-1">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsCategoryMenuOpen((isOpen) => !isOpen);
              setIsStatusMenuOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-full border border-outline/30 bg-surface-container-lowest px-3.5 py-2 text-xs font-medium text-on-surface shadow-sm transition-colors hover:border-primary"
          >
            {selectedCategory}
            <ChevronDown
              size={15}
              className={`text-on-surface-variant transition-transform ${
                isCategoryMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCategoryMenuOpen && (
            <div className="absolute left-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest p-1.5 shadow-lg">
              {categoryOptions.map((category) => {
                const isSelected = category === selectedCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => selectCategory(category)}
                    className={
                      isSelected
                        ? "flex w-full items-center justify-between rounded-lg bg-primary-container/40 px-3 py-2 text-left text-xs font-semibold text-primary"
                        : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-on-surface hover:bg-surface-container"
                    }
                  >
                    {category}
                    {isSelected && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsStatusMenuOpen((isOpen) => !isOpen);
              setIsCategoryMenuOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-full border border-outline/30 bg-surface-container-lowest px-3.5 py-2 text-xs font-medium text-on-surface shadow-sm transition-colors hover:border-primary"
          >
            Status: {selectedStatus}
            <ChevronDown
              size={15}
              className={`text-on-surface-variant transition-transform ${
                isStatusMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isStatusMenuOpen && (
            <div className="absolute left-0 top-10 z-30 w-36 overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest p-1.5 shadow-lg">
              {statusOptions.map((status) => {
                const isSelected = status === selectedStatus;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => selectStatus(status)}
                    className={
                      isSelected
                        ? "flex w-full items-center justify-between rounded-lg bg-primary-container/40 px-3 py-2 text-left text-xs font-semibold text-primary"
                        : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-on-surface hover:bg-surface-container"
                    }
                  >
                    {status}
                    {isSelected && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-outline/30 bg-surface-container-lowest px-3.5 py-2 text-xs font-medium text-on-surface shadow-sm"
        >
          Sort: Newest
          <ArrowDownUp size={15} className="text-on-surface-variant" />
        </button>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-on-surface-variant">
        <p>
          Showing{" "}
          <strong className="text-on-surface">
            {totalProducts === 0 ? 0 : `1–${displayedProducts}`}
          </strong>{" "}
          of {totalProducts} products
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            aria-label="Previous product page"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-outline/25 text-on-surface-variant opacity-40"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            disabled={totalProducts <= productsPerPage}
            aria-label="Next product page"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-outline/25 bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}