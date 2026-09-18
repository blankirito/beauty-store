import Navbar2 from "@/components/shared/Navbar2";
import OrdersClient from "@/components/order/OrdersClient";
import OrdersHeader from "@/components/order/OrdersHeader";

export default function OrderPage() {
  return (
    <main className="pb-24">
      <Navbar2 />
      <OrdersHeader />
      <OrdersClient />
    </main>
  );
}