import { ChevronRight } from "lucide-react";

const categories = [
    "Skincare",
    "Serum",
    "Anti-aging",
    "Hydration"
]

export default function PopularCategory() {
    return (
        <section className="
            px-5
            mt-10
        ">
            <h2 className="
                text-sm
                font-semibold
                tracking-widest
                text-primary
                mb-4
            ">POPULAR CATEGORY</h2>

            <div className="
                grid
                grid-cols-2
                gap-4
            ">
                {
                    categories.map(category=>(
                        <button
                            key={category}
                            className="
                                flex
                                justify-between
                                items-center
                                p-4
                                rounded-xl
                                bg-surface
                                shadow-sm
                            "
                        >
                            <span>{category}</span>
                            <ChevronRight size={18} className="text-outline"/>
                        </button>
                    ))
                }
            </div>
        </section>
    )
}