import OrderDetailClient from "@/components/admin/orders/OrderDetailClient";
import { adminOrders } from "@/data/adminOrders";
import { getAdminOrderDetail } from "@/data/adminOrderDetails";
import { notFound } from "next/navigation";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const order = adminOrders.find((item) => item.id === id);

  if (!order) {
    notFound();
  }

  return (
    <OrderDetailClient
      order={order}
      detail={getAdminOrderDetail(order.id)}
    />
  );
}