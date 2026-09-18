import OrderMetrics from "@/components/admin/orders/OrderMetrics";
import OrdersClient from "@/components/admin/orders/OrdersClient";
import OrdersHero from "@/components/admin/orders/OrdersHero";
import AdminOwnerCard from "@/components/admin/shared/AdminOwnerCard";
import { adminCustomers } from "@/data/adminCustomers";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    customer?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { customer: customerId } = await searchParams;

  const customer = customerId
    ? adminCustomers.find((item) => item.id === customerId)
    : undefined;

  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <OrdersHero />
      <OrderMetrics />

      <OrdersClient
        customerId={customerId}
        customerName={customer?.name}
      />

      <AdminOwnerCard />
    </main>
  );
}