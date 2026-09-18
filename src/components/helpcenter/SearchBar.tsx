"use client";

import { Search, X } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <Search
        size={20}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-outline"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search FAQs..."
        className="w-full rounded-full border border-outline/30 bg-surface-low py-4 pl-14 pr-12 outline-none transition focus:border-primary"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear FAQ search"
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-outline transition hover:bg-surface-container hover:text-primary"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}