import OrderItems from "./OrderCard";

const orderItems = [
    {
        id: 1, 
        name: "Abstract Silk Scarf", 
        price: 185,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
    },
    {
        id: 2, 
        name: "Ceramic Vessel No.4", 
        price: 240,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    },
    {
        id: 3, 
        name: "Pebbled Leather Tote", 
        price: 450,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
    },
]

export default function OrderList() {
    return (
        <section className="
            px-5
            mt-6
            space-y-4
        "> 
            {orderItems.map((item) => (
                <OrderItems
                    key={item.id}
                    {...item}
                />
            ))}
        </section>
    )
}