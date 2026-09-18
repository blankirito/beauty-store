import { ChevronRight } from "lucide-react";

const categories = ["Skincare", "Serum", "Anti-aging", "Hydration"];

type PopularCategoryProps = {
  onSelect: (category: string) => void;
};

export default function PopularCategory({
  onSelect,
}: PopularCategoryProps) {
  return (
    <section className="mt-10 px-5">
      <h2 className="mb-4 text-sm font-semibold tracking-widest text-primary">
        POPULAR CATEGORIES
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className="flex items-center justify-between rounded-xl bg-surface p-4 text-left shadow-sm transition hover:bg-surface-low"
          >
            <span>{category}</span>
            <ChevronRight size={18} className="text-outline" />
          </button>
        ))}
      </div>
    </section>
  );
}