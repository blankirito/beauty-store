import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItemProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  isSelected: boolean;
  onToggleSelected: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export default function CartItem({
  id,
  name,
  description,
  price,
  quantity,
  image,
  isSelected,
  onToggleSelected,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const lineTotal = price * quantity;

  return (
    <article className="flex items-center gap-4 rounded-xl bg-surface p-4 shadow-sm">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelected}
        aria-label={`Select ${name}`}
        className="h-5 w-5 flex-shrink-0 accent-primary"
      />

      <Link
        href={`/product/${id}`}
        aria-label={`View ${name}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/product/${id}`}>
              <h3 className="truncate font-display text-lg text-primary">
                {name}
              </h3>
            </Link>

            <p className="mt-0.5 truncate text-sm text-on-surface-variant">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name} from cart`}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-outline transition hover:bg-error-container hover:text-error"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex items-center rounded-full border border-outline px-2 py-1">
            <button
              type="button"
              onClick={() => onQuantityChange(quantity - 1)}
              aria-label={`Decrease ${name} quantity`}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-surface-low"
            >
              <Minus size={14} />
            </button>

            <span className="w-9 text-center text-sm font-semibold text-on-surface">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              aria-label={`Increase ${name} quantity`}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-surface-low"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              RM{lineTotal.toFixed(2)}
            </p>

            {quantity > 1 && (
              <p className="text-xs text-on-surface-variant">
                RM{price.toFixed(2)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}