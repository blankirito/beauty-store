import CustomerMetrics from "@/components/admin/customers/CustomerMetrics";
import CustomersClient from "@/components/admin/customers/CustomersClient";
import CustomersHero from "@/components/admin/customers/CustomersHero";
import AdminOwnerCard from "@/components/admin/shared/AdminOwnerCard";

export default function AdminCustomersPage() {
  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <CustomersHero />
      <CustomerMetrics />
      <CustomersClient />
      <AdminOwnerCard />
    </main>
  );
}