import { BadgeCheck, TrendingUp } from "lucide-react";

const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

export default function RevenueTrend() {
  return (
    <section className="rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Sales Performance
          </p>

          <h2 className="mt-1 font-display text-2xl text-on-surface">
            Revenue Trend
          </h2>
        </div>

        <div className="rounded-xl bg-surface-container-lowest px-3 py-2 text-right shadow-sm">
          <p className="text-[11px] text-on-surface-variant">Daily average</p>
          <p className="font-display text-lg font-semibold text-on-surface">
            RM1,610
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-container px-3.5 py-3">
        <div>
          <p className="text-xs text-on-surface-variant">Revenue velocity</p>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary">
            <TrendingUp size={16} />
            Growing steadily
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
          <BadgeCheck size={16} className="text-primary" />
          Peak: RM2,440
        </div>
      </div>

      <div className="mt-5">
        <svg
          viewBox="0 0 350 170"
          className="h-auto w-full"
          role="img"
          aria-label="Revenue increased over four weeks"
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1="14"
            y1="35"
            x2="336"
            y2="35"
            stroke="var(--outline)"
            strokeDasharray="4 4"
            opacity="0.35"
          />
          <line
            x1="14"
            y1="80"
            x2="336"
            y2="80"
            stroke="var(--outline)"
            strokeDasharray="4 4"
            opacity="0.35"
          />
          <line
            x1="14"
            y1="125"
            x2="336"
            y2="125"
            stroke="var(--outline)"
            strokeDasharray="4 4"
            opacity="0.35"
          />

          <path
            d="M16 125 C45 120, 64 118, 94 100 S135 65, 172 80 S220 95, 249 67 S298 78, 334 28 L334 145 L16 145 Z"
            fill="url(#revenue-fill)"
          />

          <path
            d="M16 125 C45 120, 64 118, 94 100 S135 65, 172 80 S220 95, 249 67 S298 78, 334 28"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {[
            [16, 125],
            [94, 100],
            [172, 80],
            [249, 67],
            [334, 28],
          ].map(([cx, cy], index) => (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={index === 4 ? "6" : "4"}
              fill="var(--surface-container-lowest)"
              stroke="var(--primary)"
              strokeWidth="3"
            />
          ))}
        </svg>

        <div className="mt-1 grid grid-cols-4 text-center text-[11px] text-on-surface-variant">
          {weekLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}