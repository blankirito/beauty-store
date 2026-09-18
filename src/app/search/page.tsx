"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar2 from "@/components/shared/Navbar2";
import SearchBar from "@/components/search/SearchBar";
import RecentSearch from "@/components/search/RecentSearch";
import PopularCategory from "@/components/search/PopularCategory";
import SearchProductGrid from "@/components/search/SearchProductGrid";
import { products } from "@/data/products";

const STORAGE_KEY = "lumina-recent-searches";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedSearches = window.localStorage.getItem(STORAGE_KEY);

    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function saveSearch(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    setRecentSearches((current) => {
      const nextSearches = [
        trimmedValue,
        ...current.filter(
          (item) => item.toLowerCase() !== trimmedValue.toLowerCase(),
        ),
      ].slice(0, 5);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSearches));

      return nextSearches;
    });
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.category,
        product.description,
        ...product.features,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery]);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <main className="pb-24">
      <Navbar2 />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={() => saveSearch(searchQuery)}
      />

      {!hasSearchQuery && (
        <>
          <RecentSearch
            searches={recentSearches}
            onSelect={setSearchQuery}
            onClear={() => {
              setRecentSearches([]);
              window.localStorage.removeItem(STORAGE_KEY);
            }}
          />

          <PopularCategory onSelect={setSearchQuery} />
        </>
      )}

      {hasSearchQuery && (
        <SearchProductGrid
          products={filteredProducts}
          searchQuery={searchQuery}
        />
      )}
    </main>
  );
}