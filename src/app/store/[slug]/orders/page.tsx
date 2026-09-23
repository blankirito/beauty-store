import Link from "next/link";
import { notFound } from "next/navigation";
import OrdersHeader from "@/components/order/OrdersHeader";
import StorefrontNavbar from "@/components/storefront/StorefrontNavbar";
import StorefrontOrdersClient from "@/components/storefront/StorefrontOrdersClient";
import { getCachedPublicStorefront } from "@/lib/storefront/publicStorefrontCache";
import { createClient } from "@/lib/supabase/server";

type StorefrontOrdersPageProps = { params: Promise<{ slug: string }> };
type DatabaseImage = { storage_path: string; is_primary: boolean; sort_order: number };

export default async function StorefrontOrdersPage({ params }: StorefrontOrdersPageProps) {
  const { slug } = await params;
  const storefront = await getCachedPublicStorefront(slug);
  if (!storefront) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen pb-24">
        <StorefrontNavbar storeName={storefront.name} homeHref={`/store/${storefront.slug}`} />
        <section className="mx-auto mt-12 max-w-md px-5 text-center">
          <h1 className="font-display text-3xl text-primary">Your orders</h1>
          <p className="mt-3 text-sm text-on-surface-variant">Sign in to view your orders from {storefront.name}.</p>
          <Link href={`/login?store=${encodeURIComponent(storefront.slug)}`} className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">Sign in</Link>
        </section>
      </main>
    );
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`order_number, fulfillment_status, total, created_at, order_items (product_name, quantity, products (product_images (storage_path, is_primary, sort_order)))`)
    .eq("store_id", storefront.id)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Could not load your store orders.");

  const orderViews = (orders ?? []).map((order) => ({
    orderNumber: order.order_number,
    fulfillmentStatus: order.fulfillment_status as "new" | "processing" | "shipped" | "delivered" | "cancelled",
    createdAt: order.created_at,
    total: Number(order.total),
    items: (order.order_items ?? []).map((item) => {
      const product = item.products as unknown as { product_images: DatabaseImage[] } | null;
      const image = product?.product_images?.find((current) => current.is_primary) ?? product?.product_images?.slice().sort((first, second) => first.sort_order - second.sort_order)[0];
      return { name: item.product_name, quantity: item.quantity, imagePath: image?.storage_path ?? null };
    }),
  }));

  return (
    <main className="min-h-screen pb-24">
      <StorefrontNavbar storeName={storefront.name} homeHref={`/store/${storefront.slug}`} />
      <OrdersHeader />
      <StorefrontOrdersClient orders={orderViews} storeSlug={storefront.slug} />
    </main>
  );
}
