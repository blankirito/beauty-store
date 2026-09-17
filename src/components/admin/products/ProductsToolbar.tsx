"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type ProductsToolbarProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function ProductsToolbar({
  searchQuery,
  onSearchQueryChange,
}: ProductsToolbarProps) {
  return (
    <section className="flex items-center gap-2">
      <label className="relative flex-1">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search inventory, SKU, or name..."
          className="h-11 w-full rounded-2xl bg-surface-container pl-10 pr-4 text-sm text-on-surface shadow-sm outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <button
        type="button"
        aria-label="Open product filters"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-high"
      >
        <SlidersHorizontal size={18} />
      </button>
    </section>
  );
}