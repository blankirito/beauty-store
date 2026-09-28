import ProductPerformanceClient from "@/components/admin/analytics/ProductPerformanceClient";
import { getAdminReportingOrders } from "@/lib/admin/getAdminReportingOrders";
import { getTopReportingProducts } from "@/lib/admin/adminReporting";

export default async function ProductPerformancePage() {
  const orders = await getAdminReportingOrders();
  const products = getTopReportingProducts(orders);

  return <ProductPerformanceClient products={products} />;
}