import DashboardIntro from "@/components/admin/dashboard/DashboardIntro";
import DashboardMetrics from "@/components/admin/dashboard/DashboardMetrics";
import RevenueGrowth from "@/components/admin/dashboard/RevenueGrowth";
import PopularProducts from "@/components/admin/dashboard/PopularProducts";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import { getAdminOrders } from "@/lib/orders/getAdminOrders";
import { getAdminReportingOrders } from "@/lib/admin/getAdminReportingOrders";
import { getReportingMetrics } from "@/lib/admin/adminReporting";
import { getTopReportingProducts } from "@/lib/admin/adminReporting";
import { getReportingRevenueByDay } from "@/lib/admin/adminReporting";
import SubscriptionReminder from "@/components/admin/dashboard/SubscriptionReminder";
import { getMerchantBilling } from "@/lib/merchants/getMerchantBilling";

export default async function AdminDashboardPage() {
  const [orders, reportingOrders, billing] = await Promise.all([
    getAdminOrders(),
    getAdminReportingOrders(),
    getMerchantBilling(),
  ]);

  const metrics = getReportingMetrics(reportingOrders);
  const popularProducts = getTopReportingProducts(reportingOrders);
  const revenueByDay = getReportingRevenueByDay(reportingOrders).slice(-7);

  return (
    <>
      <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
        <DashboardIntro />
        <SubscriptionReminder billing={billing} />
        <DashboardMetrics metrics={metrics} />
        <RevenueGrowth revenueByDay={revenueByDay} />
        <PopularProducts products={popularProducts} />
        <RecentOrders orders={orders} />
      </main>
    </>
  );
}