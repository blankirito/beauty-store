import {
  Sparkles,
  Droplets,
  Brush,
  Scissors,
  Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

const categories: {
  name: string;
  icon: LucideIcon;
}[] = [
  { name: "Beauty", icon: Sparkles },
  { name: "Skincare", icon: Droplets },
  { name: "Makeup", icon: Brush },
  { name: "Hair", icon: Scissors },
  { name: "Body Care", icon: Heart },
];

export default function CategorySelection() {
  return (
    <section className="mt-10">
      <div className="px-4">
        <h2 className="font-display text-2xl font-medium text-primary">
          Categories
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 px-4">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.name}
              href={`/category/${category.name
                .toLowerCase()
                .replace(" ", "-")}`}
              className="group flex min-w-0 flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-low text-on-surface transition duration-200 group-hover:bg-primary group-hover:text-on-primary group-active:scale-95">
                <Icon size={23} strokeWidth={1.6} />
              </div>

              <span className="min-h-8 text-center text-xs leading-4 text-on-surface-variant">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}