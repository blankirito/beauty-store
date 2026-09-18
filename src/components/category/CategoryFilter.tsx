"use client";

type CategoryFilterProps = {
  filters: readonly string[];
  activeFilter: string;
  onChange: (filter: string) => void;
};

export default function CategoryFilter({
  filters,
  activeFilter,
  onChange,
}: CategoryFilterProps) {
  return (
    <section className="mt-6 flex gap-3 overflow-x-auto px-5 no-scrollbar">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={`
              whitespace-nowrap rounded-full border px-4 py-2 text-sm transition
              ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-outline/40 bg-surface text-on-surface hover:border-primary"
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </section>
  );
}