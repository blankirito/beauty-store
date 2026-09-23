export default function StorefrontProductLoading() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="h-16 animate-pulse bg-surface" />
      <div className="aspect-[4/5] animate-pulse bg-surface-low" />
      <div className="space-y-4 px-5 py-7">
        <div className="h-9 w-2/3 animate-pulse rounded bg-surface-low" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-surface-low" />
        <div className="h-20 animate-pulse rounded-xl bg-surface-low" />
      </div>
    </main>
  );
}
