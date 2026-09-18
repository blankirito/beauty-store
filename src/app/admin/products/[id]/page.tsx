import ProductDetailClient from "@/components/admin/products/ProductDetailClient";
import { getAdminProductDetail } from "@/data/adminProductDetails";
import { getInventoryDetails } from "@/data/adminInventory";
import { products } from "@/data/products";
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
  const productId = Number(id);

  const product = products.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  const inventory = getInventoryDetails(product.id);
  const detail = getAdminProductDetail(product.id);

  return (
    <ProductDetailClient
      product={product}
      inventory={inventory}
      detail={detail}
    />
  );
}