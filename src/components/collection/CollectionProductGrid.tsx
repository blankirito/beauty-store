import ProductCard from "@/components/home/ProductCard";
import { Products } from "@/types/products"; 

type Props = {
    products: Products[];
};

export default function CollectionProductGrid({
    products,
}: Props) {
    return (
        <section className="
            px-5
            mt-10
            grid
            grid-cols-2
            gap-5
        ">
            {
                products.map(product => (
                    <ProductCard
                        key={product.id}
                        {...product}
                    />
                ))
            }
        </section>
    )
}