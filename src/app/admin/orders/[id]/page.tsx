import RealOrderDetail from "@/components/admin/orders/RealOrderDetail";
import { getAdminOrderDetail } from "@/lib/orders/getAdminOrderDetail";
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
  const result = await getAdminOrderDetail(id);

  if (!result) {
    notFound();
  }

  return (
    <RealOrderDetail
      order={result.order}
      detail={result.detail}
      timeline={result.timeline}
    />
  );
}