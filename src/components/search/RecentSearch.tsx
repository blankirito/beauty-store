
const searches = [
    "Vitamin C Serum",
    "Moisturizer",
    "Cleanser",
];

export default function RecentSearch(){
    return (

        <section className="
            px-5
            mt-8
        ">
            <div className="
                flex
                justify-between
                mb-4
            ">
                <h2 className="
                    text-sm
                    font-semibold
                    tracking-widest
                    text-primary
                ">RECENT SEARCH</h2>

                <button className="
                    text-sm
                    text-outline
                ">Clear</button>
            </div>

            <div className="
                flex
                flex-wrap
                gap-3
            ">
                {
                    searches.map(item=>(
                        <button 
                            key={item}
                            className="
                                px-5
                                py-2
                                rounded-full
                                bg-surface
                                border
                                border-outline
                                text-sm
                                text-on-surface
                            "
                        >
                            {item}
                        </button>
                    ))
                }
            </div>
        </section>
    )
}
