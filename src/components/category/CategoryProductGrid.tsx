import { Products } from "@/types/products";
import ProductCard from "@/components/home/ProductCard";

type Props = {
    products: Products[];
}

export default function CategoryProductGrid({
    products
}: Props) {
    return (
        <section className="
            px-5
            mt-8
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-4
        ">
            {
                products.map(product=>(
                    <ProductCard
                        key={product.id}
                        {...product}
                    />
                ))
            }
        </section>
    )
}