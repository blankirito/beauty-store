interface Props {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export default function OrderSummary({
    subtotal,
    shipping,
    tax,
    total,
}:Props) {
    return(
        <section className="
            bg-surface-container-lowest
            rounded-xl
            p-6
            md:p-8
            border
            border-secondary/30
            shadow-sm
        ">
            <h3 className="
                text-sm
                uppercase
                tracking-widest
                font-semibold
                text-on-surface
                mb-6
            ">Order Summary</h3>

            <div className="
                space-y-4
                text-sm
                text-on-surface-variant
            ">
                <div className="
                    flex
                    justify-between
                ">
                    <span>Subtotal</span>
                    <span className="
                        text-on-surface
                        font-medium
                    ">
                        RM{subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="
                    flex
                    justify-between
                ">
                    <span>Shipping</span>
                    <span className="
                        text-on-surface
                        font-medium
                    ">
                        RM{shipping.toFixed(2)}
                    </span>
                </div>

                <div className="
                    flex
                    justify-between
                ">
                    <span>Estimated Tax</span>
                    <span className="
                        text-on-surface
                        font-medium
                    ">
                        RM{tax.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="
                mt-6
                pt-6
                border-t
                border-surface-container-highest
                flex
                justify-between
                items-end
            ">
                <span className="
                    text-sm
                    uppercase
                    tracking-wdiest
                    font-semibold
                ">Total</span>

                <span className="
                    text-2xl
                    font-display
                    text-primary
                ">RM{total.toFixed(2)}</span>
            </div>

            <button className="
                w-full
                mt-8
                py-3
                rounded-lg
                border
                border-secondary
                text-on-surface
                font-semibold
                hover:bg-surface-container-low
                transition
            ">Download Invoice</button>
        </section>
    )
}