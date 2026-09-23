import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CircleDot,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { getPlatformAccessDestination } from "@/lib/auth/getPlatformAccessDestination";
import { getPlatformOverviewMetrics } from "@/lib/platform/platformOverview";
import type { StoreApplicationStatus } from "@/lib/merchants/storeLifecycle";
import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

type PlatformApplication = {
  storeId: string;
  name: string;
  slug: string;
  category: string;
  contactName: string;
  status: StoreApplicationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  trialEndsAt: string | null;
  createdAt: string;
};

export default async function PlatformPage() {
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

  const { data: applications, error } = await supabase
    .from("store_applications")
    .select(`
      store_id,
      status,
      category,
      contact_name,
      submitted_at,
      reviewed_at,
      trial_ends_at,
      created_at,
      stores (
        name,
        slug
      )
    `)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error("We could not load platform data.");
  }

  const platformApplications: PlatformApplication[] = (applications ?? []).map(
    (application) => {
      const store = Array.isArray(application.stores)
        ? application.stores[0]
        : application.stores;

      return {
        storeId: application.store_id,
        name: store?.name ?? "Unnamed store",
        slug: store?.slug ?? "",
        category: application.category ?? "Uncategorized",
        contactName: application.contact_name ?? "Unknown contact",
        status: application.status as StoreApplicationStatus,
        submittedAt: application.submitted_at,
        reviewedAt: application.reviewed_at,
        trialEndsAt: application.trial_ends_at,
        createdAt: application.created_at,
      };
    },
  );

  const metrics = getPlatformOverviewMetrics(
    platformApplications.map((application) => ({
      status: application.status,
      trialEndsAt: application.trialEndsAt,
    })),
  );

  const pendingApplications = platformApplications.filter(
    (application) => application.status === "pending_review",
  );

  const lifecycle = {
    trialing: platformApplications.filter(
      (application) => application.status === "trialing",
    ).length,
    active: platformApplications.filter(
      (application) => application.status === "active",
    ).length,
    pastDue: platformApplications.filter(
      (application) => application.status === "past_due",
    ).length,
    suspended: platformApplications.filter(
      (application) => application.status === "suspended",
    ).length,
  };

  const recentActivity = platformApplications.slice(0, 4);

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-20 border-b border-outline/20 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-md items-center justify-between px-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant">
                Lumina Admin
              </span>
              <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-on-secondary-container">
                Platform owner
              </span>
            </div>
            <h1 className="mt-1 font-display text-2xl text-on-surface">
              Overview
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
            <Users className="h-4 w-4" />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-md space-y-6 px-5 py-6">
        <section id="overview">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Platform status: ready
          </div>

          <h2 className="mt-2 font-display text-3xl text-on-surface">
            Platform Command
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Oversee merchant admissions, trial progress, and subscription
            health from one place.
          </p>
        </section>

        <section className="overflow-hidden rounded-2xl bg-surface-container-high p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
              Action required · {metrics.pendingApplications} pending
            </span>
            <Clock3 className="h-5 w-5 text-primary" />
          </div>

          <h3 className="mt-4 font-display text-2xl text-on-surface">
            {metrics.pendingApplications === 0
              ? "No applications awaiting review"
              : `${metrics.pendingApplications} merchant application${
                  metrics.pendingApplications === 1 ? "" : "s"
                } awaiting review`}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            Approved merchants begin their 14-day trial before their
            storefront can become publicly visible.
          </p>

          <Link
            href="/platform/reviews"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-on-primary-container"
          >
            Review applications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section id="billing">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.13em] text-on-surface-variant">
              Platform health
            </h3>
            <span className="text-xs text-on-surface-variant">
              Live database data
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Queue"
              value={metrics.pendingApplications}
              detail="Pending apps"
              icon={<FileCheck2 className="h-4 w-4" />}
            />
            <MetricCard
              label="Merchants"
              value={metrics.activeMerchants}
              detail="Public stores"
              icon={<Store className="h-4 w-4" />}
            />
            <MetricCard
              label="Trials"
              value={metrics.trialsEndingSoon}
              detail="Ending within 7 days"
              icon={<Clock3 className="h-4 w-4" />}
            />
            <MetricCard
              label="Subscription"
              value="RM0.00"
              detail="Billing not connected yet"
              icon={<Wallet className="h-4 w-4" />}
              compact
            />
          </div>
        </section>

        <section id="reviews">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h3 className="font-display text-2xl text-on-surface">
                Needs your review
              </h3>
              <p className="mt-1 text-xs text-on-surface-variant">
                Pending applications from real merchants.
              </p>
            </div>

            <span className="text-xs font-semibold text-primary">
              {metrics.pendingApplications} total
            </span>
          </div>

          {pendingApplications.length > 0 ? (
            <div className="space-y-3">
              {pendingApplications.slice(0, 2).map((application) => (
                <article
                  key={application.storeId}
                  className="rounded-2xl bg-surface-container p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate font-display text-xl text-on-surface">
                        {application.name}
                      </h4>
                      <p className="mt-1 truncate text-xs text-on-surface-variant">
                        Owner: {application.contactName} · /store/
                        {application.slug}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-secondary-container px-2 py-1 text-[10px] font-semibold text-on-secondary-container">
                      {application.category}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-outline/15 pt-3 text-xs">
                    <span className="text-on-surface-variant">
                      Submitted {formatRelativeTime(application.submittedAt)}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      Review pending
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-surface-container p-6 text-center shadow-sm">
              <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
              <h4 className="mt-3 font-display text-xl text-on-surface">
                Queue cleared
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                New merchant applications will appear here when submitted.
              </p>
            </div>
          )}
        </section>

        <section id="lifecycle">
          <h3 className="font-display text-2xl text-on-surface">
            Merchant lifecycle
          </h3>
          <p className="mt-1 text-xs text-on-surface-variant">
            Distribution across trial and subscription stages.
          </p>

          <div className="mt-3 space-y-2">
            <LifecycleRow
              label="Trialing"
              detail="Within the 14-day launch period"
              count={lifecycle.trialing}
              color="bg-secondary-container"
            />
            <LifecycleRow
              label="Active"
              detail="Public stores with an active subscription"
              count={lifecycle.active}
              color="bg-primary"
            />
            <LifecycleRow
              label="Past due"
              detail="Subscription payment needs attention"
              count={lifecycle.pastDue}
              color="bg-tertiary"
            />
            <LifecycleRow
              label="Suspended"
              detail="Administrative or policy restriction"
              count={lifecycle.suspended}
              color="bg-outline"
            />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-2xl text-on-surface">
              Recent activity
            </h3>
            <Receipt className="h-5 w-5 text-on-surface-variant" />
          </div>

          <div className="rounded-2xl bg-surface-container p-4 shadow-sm">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((application) => (
                  <ActivityRow
                    key={application.storeId}
                    application={application}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">
                Activity will appear as merchants apply and begin their trials.
              </p>
            )}
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-outline/15 bg-background/95 pb-safe backdrop-blur">
        <div className="mx-auto grid h-20 w-full max-w-md grid-cols-4 px-5">
          <BottomNavItem
            href="#overview"
            label="Overview"
            icon={<LayoutDashboard className="h-5 w-5" />}
            active
          />
          <BottomNavItem
            href="/platform/reviews"
            label="Reviews"
            icon={<FileCheck2 className="h-5 w-5" />}
            badge={metrics.pendingApplications}
          />
          <BottomNavItem
            href="#lifecycle"
            label="Merchants"
            icon={<Store className="h-5 w-5" />}
          />
          <BottomNavItem
            href="#billing"
            label="Billing"
            icon={<Wallet className="h-5 w-5" />}
          />
        </div>
      </nav>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  compact = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-surface-container p-4 shadow-sm">
      <div className="flex items-center justify-between text-on-surface-variant">
        <span className="text-xs font-medium">{label}</span>
        {icon}
      </div>
      <p
        className={`mt-4 font-display text-on-surface ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-on-surface-variant">{detail}</p>
    </div>
  );
}

function LifecycleRow({
  label,
  detail,
  count,
  color,
}: {
  label: string;
  detail: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface-container-low p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-on-surface">{label}</p>
          <p className="truncate text-xs text-on-surface-variant">{detail}</p>
        </div>
      </div>

      <span className="ml-3 shrink-0 rounded-full bg-surface-container px-2.5 py-1 text-xs font-medium text-on-surface">
        {count} {count === 1 ? "store" : "stores"}
      </span>
    </div>
  );
}

function ActivityRow({
  application,
}: {
  application: PlatformApplication;
}) {
  const activity = getActivityMessage(application);

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <CircleDot className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-sm leading-snug text-on-surface">{activity}</p>
        <p className="mt-1 text-xs text-on-surface-variant">
          {formatRelativeTime(
            application.reviewedAt ??
              application.submittedAt ??
              application.createdAt,
          )}
        </p>
      </div>
    </div>
  );
}

function BottomNavItem({
  href,
  label,
  icon,
  active = false,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`relative flex flex-col items-center justify-center gap-1 text-xs transition ${
        active
          ? "font-semibold text-primary"
          : "text-on-surface-variant hover:text-on-surface"
      }`}
    >
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-3 -top-2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-on-primary">
            {badge}
          </span>
        )}
      </span>
      {label}
    </Link>
  );
}

function getActivityMessage(application: PlatformApplication) {
  const storeName = <strong className="font-semibold">{application.name}</strong>;

  if (application.status === "pending_review") {
    return (
      <>
        {storeName} submitted an application for {application.category}.
      </>
    );
  }

  if (application.status === "trialing") {
    return <>{storeName} started its 14-day trial.</>;
  }

  if (application.status === "active") {
    return <>{storeName} is now an active merchant.</>;
  }

  if (application.status === "rejected") {
    return <>{storeName} was asked to make changes.</>;
  }

  return (
    <>
      {storeName} is currently marked as{" "}
      {application.status.replace("_", " ")}.
    </>
  );
}

function formatRelativeTime(value: string | null) {
  if (!value) {
    return "not submitted yet";
  }

  const difference = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(difference / (1000 * 60)));

  if (minutes < 60) {
    return `${minutes || 1} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}