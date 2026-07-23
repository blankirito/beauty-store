import WishListCard from "./WishListCard";
import { products } from "@/data/products";

const wishlist = [
    {
        productId: 1,
    },
    {
        productId: 2,
    },
]

export default function WishListList(){
    return (
        <section className="
            px-5
            space-y-6
        ">
            {
                wishlist.map(item=>{
                    const product = products.find(
                        product => product.id === item.productId
                    );

                    if(!product) return null;

                    return (
                        <WishListCard
                            key={product.id}
                            {...product}
                        />
                    )
                })
            }
        </section>
    )
}