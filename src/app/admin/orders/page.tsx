import OrderMetrics from "@/components/admin/orders/OrderMetrics";
import OrdersClient from "@/components/admin/orders/OrdersClient";
import OrdersHero from "@/components/admin/orders/OrdersHero";
import AdminOwnerCard from "@/components/admin/shared/AdminOwnerCard";

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <OrdersHero />
      <OrderMetrics />
      <OrdersClient />
      <AdminOwnerCard />
    </main>
  );
}