import WishListCard from "./WishListCard";

const wishlist = [
    {
        id: 1,
        name: "Luminous Dew Cream",
        price: 84,
        description: "A bio-active moisturizer infused with sea kelp and organic rosehip oil.",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    },
    {
        id: 2,
        name: "Botanical Night Oil",
        price: 110,
        description: "A restorative overnight treatment designed to deeply hydrate.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    },
]

export default function WishListList(){
    return (
        <section className="
            px-5
            space-y-6
        ">
            {
                wishlist.map(item=>(
                    <WishListCard
                        key={item.id}
                        {...item}
                    />
                ))
            }
        </section>
    )
}