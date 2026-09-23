export default function StorefrontLoading() {
  return (
    <main className="min-h-screen bg-background px-5 py-6">
      <div className="h-7 w-44 animate-pulse rounded bg-surface-low" />
      <div className="mt-7 h-12 animate-pulse rounded-xl bg-surface-low" />
      <div className="mt-7 h-64 animate-pulse rounded-xl bg-surface-low" />
      <div className="mt-10 h-8 w-36 animate-pulse rounded bg-surface-low" />
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="aspect-[3/4] animate-pulse rounded-xl bg-surface-low" />
        <div className="aspect-[3/4] animate-pulse rounded-xl bg-surface-low" />
      </div>
    </main>
  );
}
