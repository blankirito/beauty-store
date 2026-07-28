
const filters=[
    "All",
    "Hydration",
    "Anti-aging",
    "Brightening",
]

export default function CategoryFilter() {
    return (
        <section className="
            px-5
            mt-6
            flex
            gap-3
            overflow-x-auto
            no-scrollbar
        ">
            {
                filters.map(item=>(
                    <button 
                        key={item}
                        className="
                            px-4
                            py-2
                            rounded-full
                            border
                            border-outline
                            whitespace-nowrap
                            text-sm
                        "
                    >
                        {item}
                    </button>
                ))
            }
        </section>
    )
}