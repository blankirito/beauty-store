import ProductCard from "@/components/home/ProductCard";
import type { Products } from "@/types/products";

type Props = {
  products: Products[];
  searchQuery: string;
};

export default function SearchProductGrid({
  products,
  searchQuery,
}: Props) {
  if (products.length === 0) {
    return (
      <section className="mt-10 px-5 text-center">
        <div className="rounded-2xl bg-surface-low p-8">
          <h2 className="font-display text-2xl text-primary">
            No products found
          </h2>

          <p className="mt-2 text-sm text-on-surface-variant">
            We could not find anything for “{searchQuery.trim()}”.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 px-5">
      <p className="mb-4 text-sm text-on-surface-variant">
        {products.length} product{products.length === 1 ? "" : "s"} found
      </p>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}