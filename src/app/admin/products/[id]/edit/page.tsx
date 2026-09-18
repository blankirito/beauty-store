import ProductForm from "@/components/admin/products/ProductForm";
import { getAdminProductDetail } from "@/data/adminProductDetails";
import { getInventoryDetails } from "@/data/adminInventory";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  const product = products.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      mode="edit"
      product={product}
      inventory={getInventoryDetails(product.id)}
      detail={getAdminProductDetail(product.id)}
      backHref={`/admin/products/${product.id}`}
    />
  );
}