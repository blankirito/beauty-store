import CustomerDetailClient from "@/components/admin/customers/CustomerDetailClient";
import { adminCustomerDetailsById } from "@/data/adminCustomerDetails";
import { adminCustomers } from "@/data/adminCustomers";
import { adminOrders } from "@/data/adminOrders";
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

  const customer = adminCustomers.find((item) => item.id === id);
  const detail = adminCustomerDetailsById[id];

  if (!customer || !detail) {
    notFound();
  }

  const recentOrders = adminOrders.filter(
    (order) => order.customerEmail === customer.email,
  );

  return (
    <CustomerDetailClient
      customer={customer}
      detail={detail}
      recentOrders={recentOrders}
    />
  );
}