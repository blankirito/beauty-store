import Link from "next/link";

type OrderItemProps = {
  id: number;
  image: string;
  name: string;
  quantity: number;
  price: number;
};

export default function OrderItem({
  id,
  image,
  name,
  quantity,
  price,
}: OrderItemProps) {
  const lineTotal = price * quantity;

  return (
    <div className="flex gap-6 rounded-xl p-4 transition">
      <Link
        href={`/product/${id}`}
        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <Link href={`/product/${id}`}>
            <h4 className="truncate font-semibold text-on-surface">
              {name}
            </h4>
          </Link>

          <p className="mt-1 text-sm text-on-surface-variant">
            Qty: {quantity}
            {quantity > 1 && ` · RM${price.toFixed(2)} each`}
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <span className="font-semibold text-on-surface">
            RM{lineTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}