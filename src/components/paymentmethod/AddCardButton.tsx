import { Plus } from "lucide-react";

type AddCardButtonProps = {
  onClick: () => void;
};

export default function AddCardButton({ onClick }: AddCardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-outline/60 transition hover:bg-surface-low"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary transition group-hover:bg-primary-container">
        <Plus size={24} />
      </div>

      <span className="text-sm font-semibold tracking-wide text-on-surface-variant transition group-hover:text-primary">
        Add New Card
      </span>
    </button>
  );
}