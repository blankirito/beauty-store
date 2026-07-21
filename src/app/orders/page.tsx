import BottomNavigation from "@/components/shared/BottomNavigation";
import OrdersHeader from "@/components/order/OrdersHeader";
import OrderTab from "@/components/order/OrderTabs";
import OrderList from "@/components/order/OrderList";
import Navbar from "@/components/shared/Navbar";


export default function OrderPage() {
    return (
        <main className="pb-24">
            <Navbar />
            <OrdersHeader />
            <OrderTab />
            <OrderList />
            <BottomNavigation />
        </main>
    )
}