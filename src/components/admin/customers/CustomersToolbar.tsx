"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type CustomersToolbarProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function CustomersToolbar({
  searchQuery,
  onSearchQueryChange,
}: CustomersToolbarProps) {
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
          placeholder="Search customers by name, email, or ID..."
          className="h-11 w-full rounded-xl border border-outline/20 bg-surface-container pl-10 pr-4 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <button
        type="button"
        aria-label="Open customer filters"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline/20 bg-surface-container text-on-surface-variant"
      >
        <SlidersHorizontal size={18} />
      </button>
    </section>
  );
}