import Link from "next/link";
import { legalLinks } from "@/lib/legal/legalLinks";

export const metadata = {
    title: "Terms of Service | Lumina",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background px-5 py-12">
            <article className="mx-auto max-w-3xl rounded-2xl bg-surface p-6 shadow-sm sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Lumina
                </p>

                <h1 className="mt-2 font-display text-4xl text-primary">
                    Terms of Service
                </h1>

                <p className="mt-3 text-sm text-on-surface-variant">
                    Last updated: 1 October 2026
                </p>

                <div className="mt-8 space-y-7 leading-7 text-on-surface-variant">
                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Using Lumina
                        </h2>
                        <p className="mt-2">
                            By using Lumina, you agree to use the service
                            lawfully and not interfere with its security,
                            availability, or other users.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Lumina and independent stores
                        </h2>
                        <p className="mt-2">
                            Lumina provides technology that allows independent
                            merchants to operate storefronts. Each store is
                            responsible for its products, pricing, stock,
                            order fulfilment, delivery, and customer service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Customer accounts and guest orders
                        </h2>
                        <p className="mt-2">
                            Keep your account credentials private. Guest order
                            tracking links are private links and must not be
                            shared. A person with a guest tracking link may be
                            able to view the related order.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Orders and payments
                        </h2>
                        <p className="mt-2">
                            Orders are placed with the relevant store. Check
                            each store&apos;s payment instructions, delivery
                            information, and any store-specific policies before
                            completing an order.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Merchant responsibilities
                        </h2>
                        <p className="mt-2">
                            Merchants must provide accurate product information,
                            fulfil orders responsibly, protect customer
                            information, and follow all laws that apply to
                            their business.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Service availability
                        </h2>
                        <p className="mt-2">
                            We work to keep Lumina available and secure, but
                            the service may occasionally be unavailable for
                            maintenance, updates, or circumstances outside our
                            control.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Changes to these terms
                        </h2>
                        <p className="mt-2">
                            We may update these terms as Lumina develops. The
                            latest version will always be available on this
                            page.
                        </p>
                    </section>
                </div>

                <nav className="mt-10 flex flex-wrap gap-4 text-sm font-semibold text-primary">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    <Link href={legalLinks.privacy} className="hover:underline">
                        Privacy Policy
                    </Link>
                </nav>
            </article>
        </main>
    );
}