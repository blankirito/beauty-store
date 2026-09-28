import CustomerMetrics from "@/components/admin/customers/CustomerMetrics";
import CustomersClient from "@/components/admin/customers/CustomersClient";
import CustomersHero from "@/components/admin/customers/CustomersHero";
import AdminOwnerCard from "@/components/admin/shared/AdminOwnerCard";
import { buildAdminCustomerMetrics } from "@/lib/admin/adminCustomerReporting";
import { getAdminCustomers } from "@/lib/admin/getAdminCustomers";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();
  const metrics = buildAdminCustomerMetrics(customers);

  return (
    <main className="min-h-screen space-y-6 bg-surface px-5 py-6 pb-10">
      <CustomersHero />
      <CustomerMetrics metrics={metrics} />
      <CustomersClient customers={customers} />
      <AdminOwnerCard />
    </main>
  );
}