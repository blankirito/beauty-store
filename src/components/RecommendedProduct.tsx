import ProductCard from "./ProductCard";

const products = [
  {
    name: "Glow Serum",
    description: "Premium skincare",
    price: 99,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
  },
  {
    name: "Vitamin C Serum",
    description: "Brightening essence",
    price: 129,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  },
  {
    name: "Moisturizer",
    description: "Hydrating cream",
    price: 89,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
  },
  {
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
                    font-semibold
                ">
                    Recommended For You
                </h2>

                <span>Sort</span>

            </div>

            <div className="
                grid
                grid-cols-2
                gap-4
            ">
                {products.map((product) =>
                    <ProductCard
                        key={product.name}
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