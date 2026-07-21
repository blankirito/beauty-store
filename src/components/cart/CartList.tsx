import CartItem  from "./CartItem";

const cartItems = [
    {
        id: 1,
        name: "Glow Serum",
        description: "Premiun Skincare",
        price: 89,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    },
    {
        id: 2,
        name: "Vitamin C Serum",
        description: "Brightening essence",
        price: 45,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    },
    {
        id: 3,
        name: "Hydrating Face Cream",
        description: "Deep moisture formula",
        price: 185,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
    },
];
export default function CartList() {
    return (
        <section className="
            px-5
            mt-6
            space-y-4
        ">
            {cartItems.map((item) => (
                <CartItem
                    key={item.id}
                    {...item}
                />
            ))}
        </section>
    )
}