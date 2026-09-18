import CustomerForm from "@/components/admin/customers/CustomerForm";
import { adminCustomers } from "@/data/adminCustomers";
import { getAdminCustomerDetail } from "@/data/adminCustomerDetails";
import { notFound } from "next/navigation";

type EditCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;

  const customer = adminCustomers.find((item) => item.id === id);

  if (!customer) {
    notFound();
  }

  return (
    <CustomerForm
      customer={customer}
      detail={getAdminCustomerDetail(customer.id)}
      backHref={`/admin/customers/${customer.id}`}
    />
  );
}