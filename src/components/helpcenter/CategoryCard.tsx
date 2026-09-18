import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
};

export default function CategoryCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        flex flex-col items-center rounded-xl border p-6 text-center transition
        ${
          selected
            ? "border-primary bg-primary-container/20 shadow-md"
            : "border-outline/20 bg-surface-container-lowest hover:shadow-lg"
        }
      `}
    >
      <div
        className={`
          mb-5 flex h-16 w-16 items-center justify-center rounded-full transition
          ${
            selected
              ? "bg-primary text-on-primary"
              : "bg-secondary-container text-secondary"
          }
        `}
      >
        <Icon size={30} />
      </div>

      <h3 className="font-display text-xl text-primary">{title}</h3>

      <p className="mt-2 text-sm text-outline">{description}</p>
    </button>
  );
}