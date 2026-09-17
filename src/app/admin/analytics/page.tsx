import AnalyticsHero from "@/components/admin/analytics/AnalyticsHero";
import AnalyticsMetrics from "@/components/admin/analytics/AnalyticsMetrics";
import AnalyticsTimeframe from "@/components/admin/analytics/AnalyticsTimeframe";
import CustomerRetention from "@/components/admin/analytics/CustomerRetention";
import OrderDistribution from "@/components/admin/analytics/OrderDistribution";
import RevenueTrend from "@/components/admin/analytics/RevenueTrend";
import SalesByCategory from "@/components/admin/analytics/SalesByCategory";
import TopProducts from "@/components/admin/analytics/TopProducts";

export default function AdminAnalyticsPage() {
  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <AnalyticsHero />
      <AnalyticsTimeframe />
      <AnalyticsMetrics />
      <RevenueTrend />
      <SalesByCategory />
      <TopProducts />
      <CustomerRetention />
      <OrderDistribution />
    </main>
  );
}