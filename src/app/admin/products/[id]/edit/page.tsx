import ProductForm from "@/components/admin/products/ProductForm";
import { getAdminProducts } from "@/lib/products/getAdminProducts";
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

  const product = (await getAdminProducts()).find(
    (item) => item.id === id,
  );

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      mode="edit"
      product={product}
      backHref={`/admin/products/${product.id}`}
    />
  );
}