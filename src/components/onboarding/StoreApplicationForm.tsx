"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    Check,
    Flower2,
    LockKeyhole,
    Phone,
    ShieldCheck,
    Store,
    Tag,
    UserRound,
    ChevronDown,
} from "lucide-react";
import { saveStoreApplication } from "@/app/onboarding/actions";

type FormValues = {
    name: string;
    slug: string;
    category: string;
    contactName: string;
    phone: string;
    description: string;
};

type StoreApplicationFormProps = {
    initialData: FormValues;
    applicationStatus: string | null;
};

const categories = [
    "Clean Skincare & Botanicals",
    "Fine Fragrance",
    "Bath & Body",
    "Herbal Apothecary",
    "Wellness & Self-care",
    "Other",
];

export default function StoreApplicationForm({
    initialData,
    applicationStatus,
}: StoreApplicationFormProps) {
    const router = useRouter();
    const [values, setValues] = useState(initialData);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function updateField(field: keyof FormValues, value: string) {
        setValues((current) => ({ ...current, [field]: value }));

        setFieldErrors((current) => {
            const next = { ...current };
            delete next[field];
            return next;
        });
    }

    function saveApplication(submit: boolean) {
        setMessage("");
        setFieldErrors({});

        startTransition(async () => {
            const result = await saveStoreApplication({
                ...values,
                submit,
            });

            if (result.type === "validation_error") {
                setFieldErrors(result.fieldErrors);
                setMessage("Please complete the highlighted fields.");
                return;
            }

            if (result.type === "error") {
                setMessage(result.error);
                return;
            }

            if (result.status === "pending_review") {
                router.replace("/admin");
                router.refresh();
                return;
            }

            setMessage("Your store details have been saved.");
            router.refresh();
        });
    }

    function inputClass(field: keyof FormValues) {
        return `w-full rounded-xl border bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:bg-surface ${fieldErrors[field] ? "border-error" : "border-outline/40"
            }`;
    }

    return (
        <main className="min-h-screen bg-background pb-8">
            <header className="sticky top-0 z-20 border-b border-outline/20 bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                        <Flower2 className="h-5 w-5 text-primary" />
                        <span className="font-display text-xl text-on-surface">Lumina</span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                            Gateway
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                        <LockKeyhole className="h-3.5 w-3.5 text-primary" />
                        Secure
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-md px-5">
                <div className="flex items-center justify-between py-4">
                    <Link
                        href="/"
                        className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1.5 text-sm font-medium text-on-surface transition hover:bg-surface-container-high"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>

                    <h1 className="font-display text-xl text-on-surface">
                        Store Application
                    </h1>

                    <div className="w-14" />
                </div>

                <section className="mb-4 rounded-2xl bg-surface-container-low p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <ProgressStep label="Account" completed />
                        <div className="mt-4 h-1 flex-1 rounded-full bg-primary-container" />
                        <ProgressStep label="Store details" active number="2" />
                        <div className="mt-4 h-1 flex-1 rounded-full bg-surface-container-highest" />
                        <ProgressStep label="Review" number="3" />
                    </div>
                </section>

                {applicationStatus === "rejected" && (
                    <div className="mb-4 rounded-2xl border border-secondary-container bg-secondary-container/50 p-4 text-sm leading-relaxed text-on-secondary-container">
                        Your previous application needs a few changes. Update the details
                        below, then submit it again for review.
                    </div>
                )}

                <section className="mb-5 flex gap-3 rounded-2xl bg-secondary-container p-4 text-on-secondary-container shadow-sm">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <div>
                        <p className="text-sm font-semibold text-on-surface">
                            Store review
                        </p>
                        <p className="mt-1 text-sm leading-relaxed">
                            Your storefront becomes public only after our team approves your
                            application.
                        </p>
                    </div>
                </section>

                <section className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container/60 via-surface-container to-secondary-container/50 p-5 shadow-sm">
                    <div className="flex min-h-24 flex-col justify-end">
                        <div className="flex items-center gap-2 text-primary">
                            <Flower2 className="h-5 w-5" />
                            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                                Curated merchant community
                            </span>
                        </div>
                        <p className="mt-2 font-display text-2xl text-on-surface">
                            Build a boutique that feels like yours.
                        </p>
                    </div>
                </section>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        saveApplication(true);
                    }}
                    className="space-y-4"
                >
                    <FormField
                        label="Store name"
                        error={fieldErrors.name}
                        icon={<Store className="h-5 w-5" />}
                    >
                        <input
                            value={values.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            className={inputClass("name")}
                            placeholder="e.g. Aura Botanicals"
                            autoComplete="organization"
                        />
                    </FormField>

                    <FormField
                        label="Store URL handle"
                        error={fieldErrors.slug}
                        icon={<Tag className="h-5 w-5" />}
                    >
                        <div className="flex items-center rounded-xl border border-outline/40 bg-surface-container-low px-4 focus-within:border-primary focus-within:bg-surface">
                            <span className="shrink-0 text-sm text-on-surface-variant">
                                /store/
                            </span>
                            <input
                                value={values.slug}
                                onChange={(event) => updateField("slug", event.target.value)}
                                className="min-w-0 flex-1 bg-transparent py-3 pl-1 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/60"
                                placeholder="your-brand"
                                autoComplete="off"
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-on-surface-variant">
                            This becomes your boutique address.
                        </p>
                    </FormField>

                    <FormField label="Primary category" error={fieldErrors.category}>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsCategoryOpen((current) => !current)}
                                className={`${inputClass("category")} flex items-center justify-between text-left`}
                                aria-haspopup="listbox"
                                aria-expanded={isCategoryOpen}
                            >
                                <span
                                    className={
                                        values.category
                                            ? "text-on-surface"
                                            : "text-on-surface-variant/60"
                                    }
                                >
                                    {values.category || "Select a category"}
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 text-on-surface-variant transition-transform ${isCategoryOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isCategoryOpen && (
                                <div
                                    role="listbox"
                                    className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-outline/30 bg-surface p-1.5 shadow-lg"
                                >
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            role="option"
                                            aria-selected={values.category === category}
                                            onClick={() => {
                                                updateField("category", category);
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${values.category === category
                                                    ? "bg-primary-container/40 font-semibold text-on-primary-container"
                                                    : "text-on-surface hover:bg-surface-container-low"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </FormField>

                    <FormField
                        label="Authorized lead contact"
                        error={fieldErrors.contactName}
                        icon={<UserRound className="h-5 w-5" />}
                    >
                        <input
                            value={values.contactName}
                            onChange={(event) =>
                                updateField("contactName", event.target.value)
                            }
                            className={inputClass("contactName")}
                            placeholder="Full legal name"
                            autoComplete="name"
                        />
                    </FormField>

                    <FormField
                        label="Direct phone number"
                        error={fieldErrors.phone}
                        icon={<Phone className="h-5 w-5" />}
                    >
                        <input
                            value={values.phone}
                            onChange={(event) => updateField("phone", event.target.value)}
                            className={inputClass("phone")}
                            placeholder="+60 12-345 6789"
                            type="tel"
                            autoComplete="tel"
                        />
                    </FormField>

                    <FormField
                        label="Boutique manifesto & summary"
                        error={fieldErrors.description}
                        counter={`${values.description.length}/240`}
                    >
                        <textarea
                            value={values.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                            className={`${inputClass("description")} min-h-28 resize-none`}
                            placeholder="Share your brand story in a few warm, clear sentences."
                            maxLength={240}
                        />
                    </FormField>

                    {message && (
                        <p
                            role="status"
                            className="rounded-xl bg-primary-container/30 px-4 py-3 text-sm leading-relaxed text-on-primary-container"
                        >
                            {message}
                        </p>
                    )}

                    <div className="sticky bottom-0 -mx-5 flex gap-3 border-t border-outline/15 bg-background/95 px-5 pb-4 pt-3 backdrop-blur">
                        <button
                            type="button"
                            onClick={() => saveApplication(false)}
                            disabled={isPending}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-container-high px-3 py-3.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest disabled:opacity-60"
                        >
                            <Bookmark className="h-4 w-4" />
                            {isPending ? "Saving..." : "Save draft"}
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex flex-[1.35] items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-on-primary-container disabled:opacity-60"
                        >
                            {isPending ? "Saving..." : "Submit review"}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

function ProgressStep({
    label,
    number,
    completed = false,
    active = false,
}: {
    label: string;
    number?: string;
    completed?: boolean;
    active?: boolean;
}) {
    return (
        <div className="z-10 flex min-w-14 flex-col items-center gap-1.5 text-center">
            <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${active
                        ? "bg-primary text-on-primary shadow-sm"
                        : completed
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-container-highest text-on-surface-variant"
                    }`}
            >
                {completed ? <Check className="h-4 w-4" /> : number}
            </div>
            <span
                className={`text-[10px] font-medium ${active ? "text-primary" : "text-on-surface-variant"
                    }`}
            >
                {label}
            </span>
        </div>
    );
}

function FormField({
    label,
    error,
    counter,
    icon,
    children,
}: {
    label: string;
    error?: string;
    counter?: string;
    icon?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1 text-sm font-semibold text-on-surface">
                    {icon && <span className="text-outline">{icon}</span>}
                    {label}
                    <span className="text-primary">*</span>
                </label>

                {counter && (
                    <span className="text-xs text-on-surface-variant">{counter}</span>
                )}
            </div>

            {children}

            {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
        </div>
    );
}