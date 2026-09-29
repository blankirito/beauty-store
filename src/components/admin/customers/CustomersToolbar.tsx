"use client";

import { Search } from "lucide-react";

type CustomersToolbarProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
};

export default function CustomersToolbar({
  searchQuery,
  onSearchQueryChange,
}: CustomersToolbarProps) {
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
          placeholder="Search customers by name, email, or ID..."
          className="h-11 w-full rounded-xl border border-outline/20 bg-surface-container pl-10 pr-4 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/30"
        />
      </label>
    </section>
  );
}