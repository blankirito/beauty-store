import Link from "next/link";
import { products } from "@/data/products"; 

export default function Recommendation(){

    const recommendedProducts = products.slice(0, 2);
    return (
        <div>
            <h2
                className="
                    text-lg
                    font-display
                    mb-4
                "
            >
                You might also like...
            </h2>

            <div
                className="
                    grid
                    grid-cols-2
                    gap-4
                "
            >
                {
                    recommendedProducts.map(product => (
                        <Link 
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="
                                block
                                transition
                                active:scale-[0.97]
                            "
                        >
                            <div>
                                <img    
                                    src={product.image}
                                    alt={product.name}
                                    className="
                                        aspect-square
                                        rounded-xl
                                        object-cover
                                    "
                                />

                                <p className="
                                    mt-2
                                    truncate
                                ">
                                    {product.name}
                                </p>

                                <p className="
                                    text-primary
                                    font-semibold
                                ">
                                    RM{product.price}
                                </p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}