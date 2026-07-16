
const categories = [
    {
        name: "Beauty",
        icon: "✨",
    },
    {
        name: "Skincare",
        icon: "🧴",
    },
    {
        name: "Makeup",
        icon: "💄",
    },
    {
        name: "Hair",
        icon: "💇",
    },
    {
        name: "Body Care",
        icon: " 🧖",
    },
]

export default function CategorySelection() {
    return (
        <section className="mt-10">

            <div className="flex justify-between items-center px-4 mb-4">

                <h2 className="text-2xl font-semibold text-primary">Categories</h2>

                <button className="text-sm">View All</button>

            </div>

            <div className="flex gap-6 overflow-x-auto px-4 no-scrollbar">

                {categories.map((category) => (

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
                                bg-[#f3e8e3]
                                flex
                                items-center
                                justify-center
                                text-xl
                                transition
                                duration-300
                                group-hover:bg-[#845145]
                                group-hover:text-white
                            "
                        >
                            {category.icon}
                        </div>

                        <span className="text-sm">
                            {category.name}
                        </span>
                    </div>
                ))}

            </div>
        </section>
    );
}