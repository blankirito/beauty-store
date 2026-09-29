import OrdersClient from "@/components/admin/orders/OrdersClient";
import AdminOwnerCard from "@/components/admin/shared/AdminOwnerCard";
import { getAdminOrderMetrics } from "@/lib/orders/adminOrderMetrics";
import { getAdminOrders } from "@/lib/orders/getAdminOrders";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    customer?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { customer: customerId } = await searchParams;
  const orders = await getAdminOrders();
  const metrics = getAdminOrderMetrics(orders);

  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <OrdersClient
        orders={orders}
        metrics={metrics}
        customerId={customerId}
        customerName={customerId}
      />

      <AdminOwnerCard />
    </main>
  );
}