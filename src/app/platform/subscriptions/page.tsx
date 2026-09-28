import Link from "next/link";
import { ArrowLeft, CreditCard, Sparkles, Store } from "lucide-react";
import { redirect } from "next/navigation";
import { getPlatformAccessDestination } from "@/lib/auth/getPlatformAccessDestination";
import type { StoreApplicationStatus } from "@/lib/merchants/storeLifecycle";
import { createClient } from "@/lib/supabase/server";
import SuspendStoreForm from "@/components/platform/SuspendStoreForm";
import {
    grantComplimentaryAccess,
    removeComplimentaryAccess,
} from "./actions";

function formatDate(value: string | null) {
    if (!value) {
        return null;
    }

    return new Intl.DateTimeFormat("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

function getPlanLabel(planCode: string) {
    if (planCode === "lumina-monthly-founding") {
        return "Founding · RM29";
    }

    if (planCode === "lumina-monthly-complimentary") {
        return "Complimentary";
    }

    return "Standard · RM59";
}

function getStatusLabel(status: StoreApplicationStatus) {
    if (status === "trialing") return "Free trial";
    if (status === "active") return "Active";
    if (status === "past_due") return "Payment needed";
    if (status === "suspended") return "Paused";
    if (status === "pending_review") return "Pending review";

    return status.replace("_", " ");
}

export default async function PlatformSubscriptionsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_platform_admin")
        .eq("id", user.id)
        .maybeSingle();

    const destination = getPlatformAccessDestination(
        true,
        profile?.is_platform_admin ?? false,
    );

    if (destination) {
        redirect(destination);
    }

    const { data: stores, error } = await supabase
        .from("stores")
        .select(`
            id,
            name,
            slug,
            store_applications (
                status,
                trial_ends_at
            ),
            store_subscriptions (
                status,
                plan_code,
                founding_price_locked_until,
                current_period_ends_at,
                complimentary_reason,
                payment_grace_ends_at
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error("We could not load subscription data.");
    }

    const subscriptions = (stores ?? []).map((store) => {
        const application = Array.isArray(store.store_applications)
            ? store.store_applications[0]
            : store.store_applications;

        const subscription = Array.isArray(store.store_subscriptions)
            ? store.store_subscriptions[0]
            : store.store_subscriptions;

        return {
            id: store.id,
            name: store.name,
            slug: store.slug,
            applicationStatus:
                (application?.status as StoreApplicationStatus | undefined) ??
                "draft",
            trialEndsAt: application?.trial_ends_at ?? null,
            planCode: subscription?.plan_code ?? "lumina-monthly",
            subscriptionStatus: subscription?.status ?? "not_started",
            foundingPriceLockedUntil:
                subscription?.founding_price_locked_until ?? null,
            currentPeriodEndsAt: subscription?.current_period_ends_at ?? null,
            complimentaryReason: subscription?.complimentary_reason ?? null,
            paymentGraceEndsAt: subscription?.payment_grace_ends_at ?? null,
        };
    });

    return (
        <main className="min-h-screen bg-background pb-10">
            <header className="sticky top-0 z-20 border-b border-outline/20 bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-md items-center gap-3 px-5">
                    <Link
                        href="/platform"
                        aria-label="Back to platform overview"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition hover:bg-surface-container"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                            Lumina Admin
                        </p>
                        <h1 className="font-display text-2xl text-on-surface">
                            Subscriptions
                        </h1>
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-md px-5 py-6">
                <section className="rounded-2xl bg-surface-container-low p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                            <CreditCard size={19} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
                                Platform billing
                            </p>
                            <h2 className="font-display text-2xl text-on-surface">
                                {subscriptions.length} merchant
                                {subscriptions.length === 1 ? "" : "s"}
                            </h2>
                        </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                        Review each merchant&apos;s plan, trial, and subscription state.
                    </p>
                </section>

                <section className="mt-5 space-y-3">
                    {subscriptions.map((subscription) => {
                        const isComplimentary =
                            subscription.planCode ===
                            "lumina-monthly-complimentary";

                        const canManageComplimentaryAccess = [
                            "trialing",
                            "active",
                            "past_due",
                        ].includes(subscription.applicationStatus);

                        const canSuspendStore = [
                            "trialing",
                            "active",
                            "past_due",
                        ].includes(subscription.applicationStatus);

                        const relevantDate =
                            subscription.applicationStatus === "trialing"
                                ? subscription.trialEndsAt
                                : subscription.planCode ===
                                    "lumina-monthly-founding"
                                  ? subscription.foundingPriceLockedUntil
                                  : subscription.paymentGraceEndsAt ??
                                    subscription.currentPeriodEndsAt;

                        const dateLabel =
                            subscription.applicationStatus === "trialing"
                                ? "Trial ends"
                                : subscription.planCode ===
                                    "lumina-monthly-founding"
                                  ? "Founding price ends"
                                  : subscription.paymentGraceEndsAt
                                    ? "Payment grace ends"
                                    : "Current period ends";

                        return (
                            <article
                                key={subscription.id}
                                className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="truncate font-display text-xl text-on-surface">
                                            {subscription.name}
                                        </h2>
                                        <p className="mt-1 truncate text-xs text-on-surface-variant">
                                            /store/{subscription.slug}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-semibold text-on-surface-variant">
                                        {isComplimentary
                                            ? "Complimentary"
                                            : getStatusLabel(
                                                  subscription.applicationStatus,
                                              )}
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container-low px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <Store size={16} className="text-primary" />
                                        <span className="text-sm font-semibold text-on-surface">
                                            {getPlanLabel(subscription.planCode)}
                                        </span>
                                    </div>

                                    {isComplimentary ? (
                                        <span className="text-right text-[11px] text-on-surface-variant">
                                            No payment
                                            <br />
                                            required
                                        </span>
                                    ) : relevantDate ? (
                                        <span className="text-right text-[11px] text-on-surface-variant">
                                            {dateLabel}
                                            <br />
                                            {formatDate(relevantDate)}
                                        </span>
                                    ) : (
                                        <span className="text-[11px] text-on-surface-variant">
                                            No billing date yet
                                        </span>
                                    )}
                                </div>

                                {isComplimentary &&
                                subscription.complimentaryReason ? (
                                    <p className="mt-3 rounded-lg bg-primary-container/40 px-3 py-2 text-xs text-on-primary-container">
                                        Admin note:{" "}
                                        {subscription.complimentaryReason}
                                    </p>
                                ) : null}

                                {isComplimentary ? (
                                    <form
                                        action={removeComplimentaryAccess.bind(
                                            null,
                                            subscription.id,
                                        )}
                                        className="mt-4"
                                    >
                                        <button
                                            type="submit"
                                            className="w-full rounded-xl border border-error/25 bg-error-container/40 px-4 py-3 text-left transition hover:bg-error-container/60"
                                        >
                                            <span className="block text-sm font-semibold text-on-surface">
                                                Remove complimentary access
                                            </span>
                                            <span className="mt-1 block text-xs text-on-surface-variant">
                                                Returns to Standard RM59 with a
                                                7-day payment grace period.
                                            </span>
                                        </button>
                                    </form>
                                ) : canManageComplimentaryAccess ? (
                                    <form
                                        action={grantComplimentaryAccess.bind(
                                            null,
                                            subscription.id,
                                        )}
                                        className="mt-4 rounded-xl bg-surface-container-low p-3"
                                    >
                                        <label
                                            htmlFor={`reason-${subscription.id}`}
                                            className="text-xs font-medium text-on-surface-variant"
                                        >
                                            Private reason — optional
                                        </label>

                                        <input
                                            id={`reason-${subscription.id}`}
                                            name="reason"
                                            type="text"
                                            maxLength={120}
                                            placeholder="e.g. Family business"
                                            className="mt-2 w-full rounded-lg border border-outline/15 bg-white px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:border-primary"
                                        />

                                        <button
                                            type="submit"
                                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-on-primary-container"
                                        >
                                            <Sparkles size={17} />
                                            Grant complimentary access
                                        </button>
                                    </form>
                                ) : null}

                                {canSuspendStore ? (
                                    <SuspendStoreForm
                                        storeId={subscription.id}
                                        storeName={subscription.name}
                                    />
                                ) : null}
                            </article>
                        );
                    })}

                    {subscriptions.length === 0 ? (
                        <div className="rounded-2xl bg-surface-container p-8 text-center">
                            <Store className="mx-auto h-8 w-8 text-primary" />
                            <h2 className="mt-3 font-display text-2xl text-on-surface">
                                No merchant subscriptions yet
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                                Approved merchant stores will appear here.
                            </p>
                        </div>
                    ) : null}
                </section>
            </div>
        </main>
    );
}