import { categories } from "@/types/helpData";
import type { HelpCategory } from "@/types/helpData";
import CategoryCard from "./CategoryCard";

type CategoryGridProps = {
  activeCategory: HelpCategory | null;
  onCategoryChange: (category: HelpCategory | null) => void;
};

export default function CategoryGrid({
  activeCategory,
  onCategoryChange,
}: CategoryGridProps) {
  return (
    <section className="grid grid-cols-2 gap-5 lg:grid-cols-5">
      {categories.map((category) => (
        <CategoryCard
          key={category.title}
          title={category.title}
          description={category.description}
          icon={category.icon}
          selected={activeCategory === category.title}
          onClick={() =>
            onCategoryChange(
              activeCategory === category.title ? null : category.title,
            )
          }
        />
      ))}
    </section>
  );
}