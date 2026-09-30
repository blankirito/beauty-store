import { getAdminLoadingCardKeys } from "@/lib/admin/adminLoading";

export default function AdminLoading() {
  return (
    <main
      className="min-h-screen space-y-5 bg-surface px-5 py-6 pb-10"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">Loading admin page.</p>

      <div className="h-3 w-28 animate-pulse rounded bg-surface-container" />
      <div className="h-10 w-56 animate-pulse rounded bg-surface-container" />
      <div className="h-5 w-80 max-w-full animate-pulse rounded bg-surface-container" />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {getAdminLoadingCardKeys().map((key) => (
          <div
            key={key}
            className="h-36 animate-pulse rounded-2xl bg-surface-container"
          />
        ))}
      </section>

      <div className="h-64 animate-pulse rounded-2xl bg-surface-container" />
    </main>
  );
}