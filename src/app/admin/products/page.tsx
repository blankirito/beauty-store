import ProductMetrics from "@/components/admin/products/ProductMetrics";
import ProductsClient from "@/components/admin/products/ProductsClient";
import ProductsHero from "@/components/admin/products/ProductsHero";
import StoreOwnerCard from "@/components/admin/products/StoreOwnerCard";
import AdminOwnerCard from "@/components/admin/shared/AdminOwnerCard";

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <ProductsHero />
      <ProductMetrics />
      <ProductsClient />
      <AdminOwnerCard />
    </main>
  );
}