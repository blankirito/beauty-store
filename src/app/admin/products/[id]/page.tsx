import ProductDetailClient from "@/components/admin/products/ProductDetailClient";
import { getAdminProducts } from "@/lib/products/getAdminProducts";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = (await getAdminProducts()).find(
    (item) => item.id === id,
  );

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}