type Props = {
  brand: string;
  cardNumber: string;
  holder: string;
  expiry: string;
  isSelected: boolean;
  onClick: () => void;
};

export default function PaymentCard({
  brand,
  cardNumber,
  holder,
  expiry,
  isSelected,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`
        relative w-full rounded-xl p-6 text-left transition
        ${
          isSelected
            ? "border-2 border-primary shadow-[0_4px_24px_rgba(132,81,69,0.12)]"
            : "border border-outline/30 bg-surface-container-lowest hover:shadow-md"
        }
      `}
    >
      {isSelected && (
        <div className="absolute right-4 top-4 rounded-full bg-primary-container px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Selected
        </div>
      )}

      <div className="mb-8 flex items-start justify-between">
        <div className="flex h-8 w-12 items-center justify-center rounded bg-surface-container">
          <span className="text-sm font-semibold text-primary">{brand}</span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-lg tracking-widest text-on-surface">{cardNumber}</p>

        <div className="flex justify-between text-sm font-semibold uppercase text-on-surface-variant">
          <span>{holder}</span>
          <span>{expiry}</span>
        </div>
      </div>
    </button>
  );
}