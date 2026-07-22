import { categories } from "@/types/helpData";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid() {
    return (
        <section className="
            grid
            grid-cols-2
            lg:grid-cols-5
            gap-5
        ">
            {categories.map((category) => (
                <CategoryCard
                    key={category.title}
                    title={category.title}
                    description={category.description}
                    icon={category.icon}
                />
            ))}
        </section>
    )
}