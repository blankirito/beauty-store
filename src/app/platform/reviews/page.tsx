import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Store,
} from "lucide-react";
import { approveStoreApplication } from "./actions";
import { getPlatformAccessDestination } from "@/lib/auth/getPlatformAccessDestination";
import { createClient } from "@/lib/supabase/server";

export default async function PlatformReviewsPage() {
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
      category,
      contact_name,
      contact_phone,
      submitted_at,
      stores (
        name,
        slug,
        description
      )
    `)
    .eq("status", "pending_review")
    .order("submitted_at", { ascending: true });

  if (error) {
    throw new Error("We could not load pending applications.");
  }

  return (
    <main className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-20 border-b border-outline/20 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-md items-center gap-3 px-5">
          <Link
            href="/platform"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition hover:bg-surface-container"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
              Lumina Admin
            </p>
            <h1 className="font-display text-2xl text-on-surface">
              Platform Review
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-md px-5 py-6">
        <section className="rounded-2xl bg-surface-container-low p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
                Review queue
              </p>
              <h2 className="font-display text-2xl text-on-surface">
                {applications?.length ?? 0} pending application
                {(applications?.length ?? 0) === 1 ? "" : "s"}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            Approving a merchant starts their 14-day trial and makes their
            storefront eligible to become public.
          </p>
        </section>

        <section className="mt-5 space-y-4">
          {(applications ?? []).map((application) => {
            const store = Array.isArray(application.stores)
              ? application.stores[0]
              : application.stores;

            return (
              <article
                key={application.store_id}
                className="rounded-2xl bg-surface-container p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                      Pending review
                    </p>
                    <h2 className="mt-1 truncate font-display text-2xl text-on-surface">
                      {store?.name ?? "Unnamed store"}
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      /store/{store?.slug}
                    </p>
                  </div>

                  <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
                    {application.category}
                  </span>
                </div>

                <div className="mt-4 space-y-2 rounded-xl bg-surface-container-low p-4 text-sm">
                  <p>
                    <span className="text-on-surface-variant">Contact: </span>
                    <span className="font-semibold text-on-surface">
                      {application.contact_name}
                    </span>
                  </p>
                  <p>
                    <span className="text-on-surface-variant">Phone: </span>
                    <span className="font-semibold text-on-surface">
                      {application.contact_phone}
                    </span>
                  </p>
                  <p className="border-t border-outline/15 pt-3 leading-relaxed text-on-surface-variant">
                    {store?.description}
                  </p>
                </div>

                <form
                  action={approveStoreApplication.bind(
                    null,
                    application.store_id,
                  )}
                  className="mt-4"
                >
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-on-primary-container"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Approve & start 14-day trial
                  </button>
                </form>
              </article>
            );
          })}

          {(applications?.length ?? 0) === 0 && (
            <div className="rounded-2xl bg-surface-container p-8 text-center shadow-sm">
              <Store className="mx-auto h-8 w-8 text-primary" />
              <h2 className="mt-3 font-display text-2xl text-on-surface">
                Queue cleared
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                New merchant applications will appear here after submission.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}