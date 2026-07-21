

export default function OrderSummary() {
    return (
        <section className="
            mt-8
            mx-5
            bg-surface-low
            rounded-xl
            p-6
        ">
            <h3 className="
                text-xl
                font-display
                font-medium
                text-primary
                mb-5
            ">Order Summary</h3>

            <div className="
                space-y-3
                text-sm
            ">
                <div className="
                    flex
                    justify-between
                    text-on-surface-variant
                ">
                    <span>Subtotal (4 items)</span>
                    <span>RM364.00</span>
                </div>

                <div className="
                    flex
                    justify-between
                    text-on-surface-variant
                ">
                    <span>Shipping</span>
                    <span className="
                        text-secondary
                        font-semibold
                    ">FREE</span>
                </div>

                <div className="
                    flex
                    justify-between
                    text-on-surface-variant
                ">
                    <span>Taxes (Estimated)</span>
                    <span>RM29.12</span>
                </div>

                {/* Divider */}
                <div className="
                    flex
                    justify-between
                    items-center
                    border-t
                    border-outline
                    pt-4
                    mt-4
                ">
                    <span className="
                        text-2xl
                        font-display
                        text-foreground
                    ">Total</span>

                    <span className="
                        text-xl
                        font-bold
                        text-primary
                    ">RM393.12</span>
                </div>
            </div>
        </section>
    )
}