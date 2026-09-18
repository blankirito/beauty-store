import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return <ProductForm mode="create" backHref="/admin/products" />;
}