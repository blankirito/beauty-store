import OrderItem from "./OrderItem";

const items = [
    {
        id: 1, 
        name: "Abstract Silk Scarf", 
        price: 185,
        quantity: 1,
        variant:"30ml • Rosehip & Squalane",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
    },
    {
        id: 2, 
        name: "Ceramic Vessel No.4", 
        price: 240,
        quantity: 2,
        variant:"50ml • Ceramides",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    },
    {
        id: 3, 
        name: "Pebbled Leather Tote", 
        price: 450,
        quantity: 1,
        variant:"100ml • Ceramides",
        image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
    },
]

export default function OrderItems(){
    return (
        <section>
            <h3 className="
                text-sm
                uppercase
                tracking-widest
                font-semibold
                text-on-surface
                mb-6
            ">
                Purchased Items ({items.length})
            </h3>

            <div className="space-y-4">
                {
                    items.map((item)=>(
                        <OrderItem
                            key={item.id}
                            {...item}
                        />
                    ))
                }
            </div>
        </section>
    )
}