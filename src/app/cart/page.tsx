import Navbar2 from "@/components/shared/Navbar2";
import CartHeader from "@/components/cart/CartHeader";
import CartList from "@/components/cart/CartList";
import OrderSummary from "@/components/cart/OrderSummary";
import PromoCode from "@/components/cart/PromoCode";
import CheckoutBar from "@/components/cart/CheckoutBar";
import BottomNavigation from "@/components/shared/BottomNavigation";

export default function CartPage() {

    return (
        <main className="pb-24">
            <Navbar2 />
            <CartHeader />
            <CartList />
            <OrderSummary />
            <PromoCode />
            <CheckoutBar />
            {/* <BottomNavigation /> */}
        </main>
    )
}