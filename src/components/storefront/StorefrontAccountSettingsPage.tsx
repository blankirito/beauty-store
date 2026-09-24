"use client";

import { FormEvent, useState, useTransition } from "react";
import { Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import { saveStorefrontAccount } from "@/app/store/[slug]/settings/account/actions";
import Link from "next/link";

type StorefrontAccountSettingsPageProps = {
    storeName: string;
    storeSlug: string;
    fullName: string;
    email: string;
    phone: string;
};

export default function StorefrontAccountSettingsPage({
    storeName,
    storeSlug,
    fullName: initialFullName,
    email,
    phone: initialPhone,
}: StorefrontAccountSettingsPageProps) {
    const router = useRouter();
    const [fullName, setFullName] = useState(initialFullName);
    const [phone, setPhone] = useState(initialPhone);
    const [notice, setNotice] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setNotice(null);

        startTransition(async () => {
            const result = await saveStorefrontAccount({
                storeSlug,
                fullName,
                phone,
            });

            if (result.status === "requires-sign-in") {
                router.push(`/login?store=${encodeURIComponent(storeSlug)}`);
                return;
            }

            if (result.status === "error") {
                setNotice({
                    type: "error",
                    message: result.message,
                });
                return;
            }

            setNotice({
                type: "success",
                message: "Your account details have been saved.",
            });

            router.refresh();
        });
    }

    return (
        <main className="min-h-screen pb-24">
            <StorefrontHeader storeName={storeName} storeSlug={storeSlug} />

            <section className="mx-auto max-w-xl px-5 pt-9">
                <p className="text-xs font-semibold tracking-[0.2em] text-secondary">
                    YOUR STORE ACCOUNT
                </p>

                <h1 className="mt-2 font-display text-4xl text-primary">
                    Personal Information
                </h1>

                <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                    Keep your account details up to date for a smoother checkout.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 rounded-2xl bg-surface p-6 shadow-sm"
                >
                    <div className="space-y-6">
                        <AuthInput
                            id="account-name"
                            name="name"
                            label="Full Name"
                            placeholder="Your full name"
                            icon={User}
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            autoComplete="name"
                            required
                        />

                        <AuthInput
                            id="account-email"
                            name="email"
                            label="Email Address"
                            placeholder="your.email@example.com"
                            icon={Mail}
                            type="email"
                            value={email}
                            autoComplete="email"
                            readOnly
                        />

                        <div className="-mt-3 flex items-start justify-between gap-4 px-1">
                            <p className="text-xs leading-5 text-on-surface-variant">
                                This is the email you use to sign in.
                            </p>

                            <Link
                                href={`/store/${storeSlug}/settings/email`}
                                className="shrink-0 text-xs font-semibold text-primary underline underline-offset-4"
                            >
                                Change email
                            </Link>
                        </div>

                        <AuthInput
                            id="account-phone"
                            name="phone"
                            label="Phone Number"
                            placeholder="+60 12-345 6789"
                            icon={Phone}
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            autoComplete="tel"
                        />
                    </div>

                    <div className="mt-7">
                        <AuthButton
                            type="submit"
                            loading={isPending}
                            loadingtext="Saving changes..."
                        >
                            Save Changes
                        </AuthButton>
                    </div>

                    {notice && (
                        <p
                            role="status"
                            className={`mt-5 rounded-xl px-4 py-3 text-center text-sm ${notice.type === "success"
                                    ? "bg-primary-container/25 text-on-primary-container"
                                    : "bg-error-container text-error"
                                }`}
                        >
                            {notice.message}
                        </p>
                    )}
                </form>
            </section>
        </main>
    );
}