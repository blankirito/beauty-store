import type { CustomerOrder } from "@/data/customerOrders";
import { products } from "@/data/products";
import OrderCard from "./OrderCard";

type OrderListProps = {
  items: CustomerOrder[];
};

export default function OrderList({ items }: OrderListProps) {
  const displayOrders = items.flatMap((order) => {
    const firstItem = order.items[0];

    const product = products.find(
      (currentProduct) => currentProduct.id === firstItem.productId,
    );

    return product ? [{ order, product }] : [];
  });

  if (displayOrders.length === 0) {
    return (
      <section className="mx-5 mt-8 rounded-2xl bg-surface-low p-8 text-center">
        <h2 className="font-display text-2xl text-primary">
          No orders found
        </h2>

        <p className="mt-2 text-sm text-on-surface-variant">
          There are no orders in this category yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 space-y-4 px-5">
      {displayOrders.map(({ order, product }) => (
        <OrderCard
          key={order.id}
          order={order}
          product={product}
        />
      ))}
    </section>
  );
}