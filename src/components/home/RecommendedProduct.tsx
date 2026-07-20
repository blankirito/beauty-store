import ProductCard from "./ProductCard";
import { 
    Search,
    SlidersHorizontal
} from "lucide-react";

const products = [
    {
    id: 1,
    name: "Glow Serum",
    description: "Premium skincare",
    price: 99,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
  },
    {
    id: 2,
    name: "Vitamin C Serum",
    description: "Brightening essence",
    price: 129,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
    {
    id: 3,
    name: "Moisturizer",
    description: "Hydrating cream",
    price: 89,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
  },
    {
    id: 4,
    name: "Cleanser",
    description: "Gentle face wash",
    price: 59,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1601612628452-9e99ced43524",
  },
];

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