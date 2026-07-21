import Navbar from "@/components/shared/Navbar";
import WishListList from "@/components/wishlist/WishListList";
import WishListHeader from "@/components/wishlist/WishListHeader";

export default function WishListPage(){
    return (
        <main>
            <Navbar />
            <WishListHeader />
            <WishListList />
        </main>
    )
}