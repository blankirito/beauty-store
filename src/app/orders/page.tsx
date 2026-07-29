import BottomNavigation from "@/components/shared/BottomNavigation";
import OrdersHeader from "@/components/order/OrdersHeader";
import OrderTab from "@/components/order/OrderTabs";
import OrderList from "@/components/order/OrderList";
import Navbar2 from "@/components/shared/Navbar2";


export default function OrderPage() {
    return (
        <main className="pb-24">
            <Navbar2 />
            <OrdersHeader />
            <OrderTab />
            <OrderList />
            {/* <BottomNavigation /> */}
        </main>
    )
}