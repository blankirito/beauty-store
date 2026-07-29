import Navbar2 from "@/components/shared/Navbar2";
import WishListList from "@/components/wishlist/WishListList";
import WishListHeader from "@/components/wishlist/WishListHeader";

export default function WishListPage(){
    return (
        <main>
            <Navbar2 />
            <WishListHeader />
            <WishListList />
        </main>
    )
}