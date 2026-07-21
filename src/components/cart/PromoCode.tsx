

export default function PromoCode() {
    return (
        <section className="
            mx-5
            mt-5
        ">
            <div className="
                flex
                items-center
                gap-3
            ">
                <input
                    type="text"
                    placeholder="Enter promo code"
                    className="
                        flex-1
                        bg-surface
                        border
                        border-outline
                        rounded-full
                        px-5
                        py-3
                        text-sm
                        outline-none
                        focus:ring-2
                        focus:ring-primary
                "/>

                <button className="
                    px-6
                    py-3
                    rounded-full
                    bg-primary-container
                    text-primary
                    font-semibold
                    text-sm
                    hover:opacity-90
                    active:scale-95
                    transition
                ">APPLY</button>
            </div>
        </section>
    )
}