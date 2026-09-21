import ProductMetrics from "@/components/admin/products/ProductMetrics";
import ProductsClient from "@/components/admin/products/ProductsClient";
import ProductsHero from "@/components/admin/products/ProductsHero";
import AdminOwnerCard from "@/components/admin/shared/AdminOwnerCard";
import { getAdminProducts } from "@/lib/products/getAdminProducts";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <ProductsHero />
      <ProductMetrics products={products} />
      <ProductsClient products={products} />
      <AdminOwnerCard />
    </main>
  );
}