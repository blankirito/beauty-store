"use client";

import { Search } from "lucide-react";

type OrdersToolbarProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function OrdersToolbar({
  searchQuery,
  onSearchQueryChange,
}: OrdersToolbarProps) {
  return (
    <section className="flex items-center">
      <label className="relative w-full">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search orders, customer, or ID..."
          className="h-11 w-full rounded-2xl bg-surface-container pl-10 pr-4 text-sm text-on-surface shadow-sm outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/30"
        />
      </label>
    </section>
  );
}