import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function RecommendedProducts() {
  return (
    <section className="mt-10 px-4">
      <h2 className="font-display text-2xl font-medium text-primary">
        Recommended For You
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            rating={product.rating}
            image={product.image}
            description={product.description}
          />
        ))}
      </div>
    </section>
  );
}