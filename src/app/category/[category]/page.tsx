import Navbar from "@/components/shared/Navbar";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryFilter from "@/components/category/CategoryFilter";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";

import { products } from "@/data/products";

type Props = {
    params: Promise<{
        category: string;
    }>
}

export default async function CategoryProductPage({
    params
}: Props){

    const {category} = await params;

    const filteredProducts = products.filter(
        product =>
        product.category.toLowerCase()
        === category.toLowerCase()
    );

    const displayCategory =
    category
    .replace("-"," ")
    .replace(/\b\w/g,char=>char.toUpperCase());

    return(
        <main className="pb-24">
            <Navbar />
            <CategoryHeader
                category={displayCategory}
                count={filteredProducts.length}
            />

            <CategoryFilter />

            <CategoryProductGrid
                products={filteredProducts}
            />
        </main>
    )
}