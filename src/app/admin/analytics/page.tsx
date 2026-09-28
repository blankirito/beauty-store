import AnalyticsHero from "@/components/admin/analytics/AnalyticsHero";
import AnalyticsMetrics from "@/components/admin/analytics/AnalyticsMetrics";
import AnalyticsTimeframe from "@/components/admin/analytics/AnalyticsTimeframe";
import CustomerRetention from "@/components/admin/analytics/CustomerRetention";
import OrderDistribution from "@/components/admin/analytics/OrderDistribution";
import RevenueTrend from "@/components/admin/analytics/RevenueTrend";
import SalesByCategory from "@/components/admin/analytics/SalesByCategory";
import TopProducts from "@/components/admin/analytics/TopProducts";
import { getAdminReportingOrders } from "@/lib/admin/getAdminReportingOrders";
import {
  getReportingCategories,
  getReportingMetrics,
  getReportingRevenueByDay,
  getTopReportingProducts,
  getReportingOrderDistribution,
  filterReportingOrdersByDate,
  getReportingDateRange,
  type ReportingTimeframe,
} from "@/lib/admin/adminReporting";
import { getAdminCustomers } from "@/lib/admin/getAdminCustomers";
import { getCustomerRetentionMetrics } from "@/lib/admin/adminCustomerReporting";

type AdminAnalyticsPageProps = {
  searchParams: Promise<{
    timeframe?: string;
  }>;
};

const validTimeframes: ReportingTimeframe[] = [
  "7-days",
  "30-days",
  "this-month",
  "this-year",
];

export default async function AdminAnalyticsPage({
  searchParams,
}: AdminAnalyticsPageProps) {
  const { timeframe } = await searchParams;

  const selectedTimeframe = validTimeframes.includes(
    timeframe as ReportingTimeframe,
  )
    ? (timeframe as ReportingTimeframe)
    : "this-month";

  const [orders, customers] = await Promise.all([
    getAdminReportingOrders(),
    getAdminCustomers(),
  ]);

  const range = getReportingDateRange(
    selectedTimeframe,
    new Date(),
  );

  const filteredOrders = filterReportingOrdersByDate(
    orders,
    range,
  );

  const retention = getCustomerRetentionMetrics(customers);

  const metrics = getReportingMetrics(filteredOrders);
  const revenueByDay = getReportingRevenueByDay(filteredOrders).slice(-7);
  const categories = getReportingCategories(filteredOrders);
  const products = getTopReportingProducts(filteredOrders);
  const orderDistribution = getReportingOrderDistribution(filteredOrders);

  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <AnalyticsHero />
      <AnalyticsTimeframe
        timeframe={selectedTimeframe}
        range={range}
      />
      <AnalyticsMetrics metrics={metrics} />
      <RevenueTrend revenueByDay={revenueByDay} />
      <SalesByCategory categories={categories} />
      <TopProducts products={products} />
      <CustomerRetention retention={retention} />
      <OrderDistribution distribution={orderDistribution} />
    </main>
  );
}