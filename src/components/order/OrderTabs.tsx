
const tabs = [
    "All",
    "Pending",
    "Processing",
    "Shipping",
    "Completed",
];

export default function OrderTab() {
    return (
        <section className="
            sticky
            top-16
            z-40
            bg-background
            border-b
            border-outline
        ">
            <div className="
                flex
                overflow-x-auto
                no-scrollbar
                px-5
            ">
                {
                    tabs.map((tab, index) => (
                        <button 
                            key={tab}
                            className={`
                                whitespace-nowaap
                                px-4
                                py-4
                                text-sm
                                font-semibold
                                border-b-2
                                transition
                                ${
                                    index === 0 ? "text-primary border-primary" 
                                                : "text-on-surface-variant border-transparent"
                                }
                             `}
                        >
                            {tab}
                        </button>
                    ))
                }
            </div>
        </section>
    )
}