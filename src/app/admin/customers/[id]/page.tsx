import CustomerDetailClient from "@/components/admin/customers/CustomerDetailClient";
import { getAdminCustomers } from "@/lib/admin/getAdminCustomers";
import { getAdminOrders } from "@/lib/orders/getAdminOrders";
import { notFound } from "next/navigation";

type CustomerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const customerId = decodeURIComponent(id);

  const [customers, orders] = await Promise.all([
    getAdminCustomers(),
    getAdminOrders(),
  ]);

  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    notFound();
  }

  const recentOrders = orders.filter((order) => {
    if (customer.isGuest) {
      return (
        order.customerEmail.trim().toLowerCase() ===
        customer.email.trim().toLowerCase()
      );
    }

    return order.customerId === customer.id;
  });

  return (
    <CustomerDetailClient
      customer={customer}
      recentOrders={recentOrders}
    />
  );
}