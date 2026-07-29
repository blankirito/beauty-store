"use client";

import Navbar2 from "@/components/shared/Navbar2";
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
            <Navbar2 />
            
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