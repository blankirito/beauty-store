import type { Address } from "@/types/address";

type AddressCardProps = {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-outline/30 bg-surface p-5 shadow-sm transition hover:shadow-lg md:p-8">
      <div>
        <div className="mb-6 flex items-start justify-between">
          <span
            className={
              address.isDefault
                ? "rounded-full bg-secondary-container px-3 py-1 text-xs font-medium uppercase tracking-widest text-on-secondary-container"
                : "rounded-full bg-surface-low px-3 py-1 text-xs font-medium uppercase tracking-widest text-on-surface-variant"
            }
          >
            {address.label}
          </span>

          {address.isDefault && (
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              ✓ Default
            </span>
          )}
        </div>

        <h3 className="mb-2 font-display text-xl font-medium text-primary md:text-2xl">
          {address.name}
        </h3>

        <p className="mb-1 text-sm text-on-surface-variant md:text-base">
          {address.phone}
        </p>

        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
          {address.address}
          <br />
          {address.city}, {address.state}
          <br />
          {address.postcode}
          <br />
          {address.country}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-outline/30 pt-5">
        {!address.isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            className="text-sm font-semibold text-primary transition hover:opacity-70"
          >
            Set as default
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-semibold text-primary transition hover:opacity-70"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="text-sm font-semibold text-on-surface-variant transition hover:text-error"
        >
          Delete
        </button>
      </div>
    </article>
  );
}