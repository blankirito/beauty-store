import Link from "next/link";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <section className="mt-4 px-4">
      <Link
        href="/search"
        aria-label="Search products"
        className="flex h-12 items-center gap-3 rounded-xl bg-surface-low px-4 transition hover:bg-surface-container"
      >
        <Search size={18} className="text-on-surface-variant" />

        <span className="text-sm text-on-surface-variant">
          Search curated collection...
        </span>
      </Link>
    </section>
  );
}