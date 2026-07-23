import ProductCard from "./ProductCard";
import { 
    Search,
    SlidersHorizontal
} from "lucide-react";

import { products } from "@/data/products";

export default function RecommendedProducts() {
    return (
        <section className="mt-10 px-4">

            <div className="
                flex
                justify-between
                items-center
                mb-6
            ">

                <h2 className="
                    text-2xl
                    font-display
                    font-medium
                    text-primary
                ">
                    Recommended For You
                </h2>

                <button className="
                    w-10
                    h-10
                    flex
                    items-center
                    justify-center
                    text-on-surface-variant
                    hover:text-primary
                    transition
                ">
                    <SlidersHorizontal size={18} />
                </button>

            </div>

            <div className="
                grid
                grid-cols-2
                gap-4
            ">
                {products.map((product) =>
                    <ProductCard
                        key={product.id}
                        id={product.id }
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        rating={product.rating}
                        image={product.image}
                    />
                )}
            </div>
        </section>
    );
}