import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PaymentMethodEditor from "@/components/admin/settings/PaymentMethodEditor";
import { getAdminStorePaymentMethods } from "@/lib/payments/getAdminStorePaymentMethods";

export default async function AdminPaymentSettingsPage() {
  const paymentMethods = await getAdminStorePaymentMethods();

  return (
    <main className="min-h-screen bg-surface px-5 py-6 pb-10">
      <Link
        href="/admin/settings"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition hover:text-primary"
      >
        <ArrowLeft size={17} />
        Store Settings
      </Link>

      <section className="pb-8 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Checkout Settings
        </p>

        <h1 className="mt-2 font-display text-4xl text-on-surface">
          Payment Methods
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant">
          Control which payment methods customers can use when checking out.
        </p>
      </section>

      <PaymentMethodEditor paymentMethods={paymentMethods} />
    </main>
  );
}