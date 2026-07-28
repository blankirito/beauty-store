"use client";

import Navbar from "@/components/shared/Navbar";
import SearchBar from "@/components/search/SearchBar";
import RecentSearch from "@/components/search/RecentSearch";
import PopularCategory from "@/components/search/PopularCategory";
import SearchProductGrid from "@/components/search/SearchProductGrid";
import FilterBar from "@/components/search/FilterBar";

import { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/home/ProductCard";

export default function SearchPage() {

    const [Search, setSearch] = useState("");

    const filteredProducts = products.filter(product => 
        product.name
        .toLowerCase()
        .includes(Search.toLowerCase())
    );

    return(
        <main className="pb-10">
            <Navbar />
            
            <SearchBar 
                value={Search}
                onChange={setSearch}
            />

            {
                Search === "" &&
                <>
                    <RecentSearch />
                    <PopularCategory />
                </>
            }
            
            <SearchProductGrid 
                products = {filteredProducts}
            />
        </main>
    )
}