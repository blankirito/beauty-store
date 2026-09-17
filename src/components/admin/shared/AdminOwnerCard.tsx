import { Settings2, Sparkles } from "lucide-react";

export default function AdminOwnerCard() {
  return (
    <section className="flex items-center justify-between rounded-2xl border border-outline/15 bg-surface-container p-3.5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-on-primary shadow-inner">
            AM
          </div>

          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface-container bg-primary" />
        </div>

        <div>
          <div className="flex items-center gap-1">
            <h2 className="text-xs font-semibold text-on-surface">
              Alex Morgan
            </h2>
            <Sparkles size={13} className="text-primary" />
          </div>

          <p className="text-[10px] font-medium text-on-surface-variant">
            Store Owner · Atelier Tier
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Open store preferences"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline/20 bg-surface-container-lowest text-on-surface-variant transition-colors hover:bg-surface"
      >
        <Settings2 size={17} />
      </button>
    </section>
  );
}