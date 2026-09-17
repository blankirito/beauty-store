import DashboardIntro from "@/components/admin/dashboard/DashboardIntro";
import DashboardMetrics from "@/components/admin/dashboard/DashboardMetrics";
import RevenueGrowth from "@/components/admin/dashboard/RevenueGrowth";
import PopularProducts from "@/components/admin/dashboard/PopularProducts";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";

export default function AdminDashboardPage() {
  return (
    <>
      <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
        <DashboardIntro />
        <DashboardMetrics />
        <RevenueGrowth />
        <PopularProducts />
        <RecentOrders />
      </main>
    </>
  );
}