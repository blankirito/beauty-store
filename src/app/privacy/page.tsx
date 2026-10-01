import Link from "next/link";
import { legalLinks } from "@/lib/legal/legalLinks";

export const metadata = {
    title: "Privacy Policy | Lumina",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background px-5 py-12">
            <article className="mx-auto max-w-3xl rounded-2xl bg-surface p-6 shadow-sm sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Lumina
                </p>

                <h1 className="mt-2 font-display text-4xl text-primary">
                    Privacy Policy
                </h1>

                <p className="mt-3 text-sm text-on-surface-variant">
                    Last updated: 1 October 2026
                </p>

                <div className="mt-8 space-y-7 leading-7 text-on-surface-variant">
                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            What this policy covers
                        </h2>
                        <p className="mt-2">
                            This policy explains how Lumina handles personal
                            information when you use a Lumina storefront,
                            customer account, merchant portal, or platform
                            service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Information we handle
                        </h2>
                        <p className="mt-2">
                            Depending on how you use Lumina, this may include
                            your name, email address, phone number, delivery
                            address, account details, order details, and
                            communications you send to a store or support.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            How information is used
                        </h2>
                        <p className="mt-2">
                            We use this information to provide accounts,
                            process and track orders, support merchants,
                            respond to requests, protect the service, and
                            improve the reliability of Lumina.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Stores and service providers
                        </h2>
                        <p className="mt-2">
                            Order information is shared with the relevant store
                            so it can fulfil the order and provide customer
                            support. Lumina uses service providers for hosting,
                            authentication, database, and storage services.
                            We do not sell personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Payments
                        </h2>
                        <p className="mt-2">
                            Lumina does not collect or store card numbers.
                            Payment instructions and payment methods are
                            provided by the relevant store or payment provider.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Your choices
                        </h2>
                        <p className="mt-2">
                            You can review or update account information through
                            the relevant account settings. For sign-in help,
                            use the support option on the Lumina login page.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl text-primary">
                            Changes to this policy
                        </h2>
                        <p className="mt-2">
                            We may update this policy when Lumina changes. The
                            latest version will always be available on this
                            page.
                        </p>
                    </section>
                </div>

                <nav className="mt-10 flex flex-wrap gap-4 text-sm font-semibold text-primary">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    <Link href={legalLinks.terms} className="hover:underline">
                        Terms of Service
                    </Link>
                </nav>
            </article>
        </main>
    );
}