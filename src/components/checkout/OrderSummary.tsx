import OrderItem from "./OrderItem";
import { products } from "@/data/products";

const orderItems = [
    {
        productId: 1,
        quantity: 1,
        variant: "Color: Charcoal",
    },
    {
        productId: 3,
        quantity: 3,
        variant: "Size: OS",
    },
]

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
                {
                    orderItems.map(item=>{
                        const product = products.find(
                            product => product.id === item.productId
                        );

                        if(!product) return null;

                        return (
                            <OrderItem
                                key={product.id}
                                image={product.image}
                                title={product.name}
                                price={product.price}
                                quantity={item.quantity}
                                variant={item.variant}
                            />
                        )
                    })
                }
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