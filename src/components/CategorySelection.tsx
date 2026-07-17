import {
    Sparkles,
    Droplets,
    Brush,
    Scissors,
    Heart,
    LucideIcon,
} from "lucide-react";

const categories: {
    name: string;
    icon: LucideIcon;
}[] = [
    {
        name: "Beauty",
        icon: Sparkles,
    },
    {
        name: "Skincare",
        icon: Droplets,
    },
    {
        name: "Makeup",
        icon: Brush,
    },
    {
        name: "Hair",
        icon: Scissors,
    },
    {
        name: "Body Care",
        icon: Heart,
    },
]

export default function CategorySelection() {
    return (
        <section className="mt-10">

            <div className="flex justify-between items-center px-4 mb-4">

                <h2 className="text-2xl font-display font-medium text-on-surface">Categories</h2>

                <button className="text-sm text-primary font-medium">View All</button>

            </div>

            <div className="flex gap-6 overflow-x-auto px-4 no-scrollbar">

                {categories.map((category) => {

                    const Icon = category.icon;

                    return (
                        <div
                            key={category.name}
                            className="
                            group
                            flex
                            flex-col
                            items-center
                            gap-2
                            min-w-[72px]
                            cursor-pointer
                            "
                        >
                            <div
                                className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-surface-low
                                flex
                                items-center
                                justify-center
                                text-xl
                                transition
                                duration-300
                                group-hover:bg-primary
                                group-hover:text-on-primary
                                group-hover:scale-105
                            ">
                                <Icon size={26} strokeWidth={1.5} />
                            </div>

                            <span className="text-sm text-on-surface-variant">
                                {category.name}
                            </span>
                        </div>
                    )
                }
                    
                )}

            </div>
        </section>
    );
}