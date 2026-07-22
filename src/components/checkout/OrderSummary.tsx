import OrderItem from "./OrderItem";

export default function OrderSummary() {
    return (
        <section className="
            w-full
            bg-surface-low
            rounded-xl
            p-6
            border
            border-outline/30
        ">
            <h2 className="
                text-lg
                font-display
                font-semibold
                mb-5
            ">Order Summary</h2>

            <div className="
                space-y-4
                mb-6
            ">
                <OrderItem
                    image="https://images.unsplash.com/photo-1556228578-8c89e6adf883"
                    title="Handcrafted Wallet"
                    price={85}
                    quantity={1}
                    variant="Color: Charcoal"
                />

                <OrderItem
                    image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
                    title="Vitamin C Serum"
                    price={125}
                    quantity={2}
                    variant="Size: OS"
                />
            </div>

            <div className="
                border-t
                border-outline/30
                pt-5
                space-y-3
            ">
                <div className="
                    flex
                    justify-between
                    text-sm
                    text-on-surface-variant
                ">
                    <span>Subtotal</span>
                    <span>RM210.00</span>
                </div>

                <div className="
                    flex
                    justify-between
                    text-sm
                    text-on-surface-variant
                ">
                    <span>Shipping</span>
                    <span className="
                        text-secondary
                        font-semibold
                    ">Free</span>
                </div>

                <div className="
                    flex
                    justify-between
                    text-sm
                    text-on-surface-variant
                ">
                    <span>Estimated Tax</span>
                    <span>RM18.90</span>
                </div>

                <div className="
                    flex
                    justify-between
                    border-t
                    border-outline/30
                    pt-4
                ">
                    <span className="
                        text-lg
                        font-display
                        font-semibold
                    ">Total</span>

                    <span className="
                        text-lg
                        font-bold
                        text-primary
                    ">RM228.90</span>
                </div>
            </div>
        </section>
    );
}