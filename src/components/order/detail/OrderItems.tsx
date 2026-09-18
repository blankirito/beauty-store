import type { Products } from "@/types/products";
import OrderItem from "./OrderItem";

type OrderItemsProps = {
  items: {
    product: Products;
    quantity: number;
  }[];
};

export default function OrderItems({ items }: OrderItemsProps) {
  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <section>
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-on-surface">
        Purchased Items ({itemCount})
      </h3>

      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <OrderItem
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            quantity={quantity}
          />
        ))}
      </div>
    </section>
  );
}