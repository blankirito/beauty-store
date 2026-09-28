import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BillingStatusCard from "@/components/admin/billing/BillingStatusCard";
import { getMerchantBilling } from "@/lib/merchants/getMerchantBilling";
import { notFound } from "next/navigation";

export default async function AdminBillingPage() {
  const billing = await getMerchantBilling();

  if (!billing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface px-5 py-6 pb-10">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center gap-3">
          <Link
            href="/admin"
            aria-label="Back to dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition hover:bg-surface-container"
          >
            <ArrowLeft size={21} />
          </Link>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
              Lumina Admin
            </p>
            <h1 className="mt-1 font-display text-3xl text-on-surface">
              Billing & Subscription
            </h1>
          </div>
        </header>

        <p className="mt-5 text-sm leading-relaxed text-on-surface-variant">
          Review your trial, monthly plan, and billing history.
        </p>

        <BillingStatusCard billing={billing} />
      </div>
    </main>
  );
}