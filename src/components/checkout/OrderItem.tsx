type OrderItemProps = {
  image: string;
  title: string;
  price: number;
  quantity: number;
};

export default function OrderItem({
  image,
  title,
  price,
  quantity,
}: OrderItemProps) {
  const lineTotal = price * quantity;

  return (
    <div className="flex gap-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="min-w-0 flex-1 truncate text-base font-semibold leading-tight text-on-surface">
            {title}
          </p>

          <p className="flex-shrink-0 whitespace-nowrap text-base font-bold text-on-surface">
            RM{lineTotal.toFixed(2)}
          </p>
        </div>

        <p className="mt-1 text-sm text-on-surface-variant">
          Qty: {quantity}
          {quantity > 1 && ` · RM${price.toFixed(2)} each`}
        </p>
      </div>
    </div>
  );
}