import CartItem  from "./CartItem";
import { products } from "@/data/products";

const cartItems = [
    {
        productId: 1,
        quantity: 1,
    },
    {
        productId: 2,
        quantity: 2,
    },
    {
        productId: 3,
        quantity: 5,
    },
];
export default function CartList() {
    return (
        <section className="
            px-5
            mt-6
            space-y-4
        ">
            {
                cartItems.map((item) => {
                    const product = products.find(
                        product => product.id === item.productId
                    );

                    if(!product) return null;

                    return (
                        <CartItem
                            key={product.id}
                            {...product}
                            quantity={item.quantity}
                        />
                    )
                })
            }
        </section>
    )
}