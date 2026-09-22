"use client";

import { useState } from "react";
import type { ProductStatusLabel } from "@/lib/products/productStatus";
import { toDisplayProductStatus } from "@/lib/products/productStatus";
import type { AdminProduct } from "@/lib/products/adminProduct";
import ProductFilters from "./ProductFilters";
import ProductList from "./ProductList";
import ProductPagination from "./ProductPagination";
import ProductsToolbar from "./ProductsToolbar";

type StatusFilter = "All" | ProductStatusLabel;

type ProductsClientProps = {
  products: AdminProduct[];
};

export default function ProductsClient({
  products,
}: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>("All");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.sku.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All"
        ? product.status !== "archived"
        : toDisplayProductStatus(product.status) === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <ProductsToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        totalProducts={filteredProducts.length}
      />

      <ProductList items={filteredProducts} />

      <ProductPagination totalProducts={filteredProducts.length} />
    </div>
  );
}