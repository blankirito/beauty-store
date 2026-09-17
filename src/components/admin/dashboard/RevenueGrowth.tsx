import { BadgeCheck } from "lucide-react";

export default function RevenueGrowth() {
  return (
    <section className="rounded-xl bg-surface-container-low p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Performance
          </p>
          <h2 className="font-display text-2xl text-on-surface">
            Revenue Growth
          </h2>
        </div>

        <div className="flex rounded-lg bg-surface-container p-0.5 text-xs font-medium">
          <button
            type="button"
            className="rounded-md bg-surface px-2.5 py-1 text-on-surface shadow-sm"
          >
            Line
          </button>

          <button
            type="button"
            className="rounded-md px-2.5 py-1 text-on-surface-variant"
          >
            Bar
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-end justify-between rounded-lg bg-surface-container px-3 py-2">
        <div>
          <p className="text-xs text-on-surface-variant">
            Today Peak Revenue
          </p>
          <p className="font-display text-2xl font-semibold text-on-surface">
            RM3,840.00
          </p>
        </div>

        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          <BadgeCheck size={16} />
          Peak daily
        </span>
      </div>

      <div className="pt-2">
        <svg
          viewBox="0 0 340 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-36 w-full overflow-visible"
          aria-label="Revenue growth chart"
          role="img"
        >
          <defs>
            <linearGradient
              id="revenueGradient"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#77574d" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#fff8f5" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="30"
            x2="340"
            y2="30"
            stroke="#e9e1dc"
            strokeDasharray="3 3"
          />
          <line
            x1="0"
            y1="75"
            x2="340"
            y2="75"
            stroke="#e9e1dc"
            strokeDasharray="3 3"
          />
          <line x1="0" y1="120" x2="340" y2="120" stroke="#e9e1dc" />

          <path
            d="M 10 105 C 45 95, 75 110, 110 70 C 145 35, 175 80, 210 50 C 245 25, 275 60, 310 18 L 310 120 L 10 120 Z"
            fill="url(#revenueGradient)"
          />
          <path
            d="M 10 105 C 45 95, 75 110, 110 70 C 145 35, 175 80, 210 50 C 245 25, 275 60, 310 18"
            stroke="#77574d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="10" cy="105" r="3.5" fill="white" stroke="#77574d" strokeWidth="2" />
          <circle cx="110" cy="70" r="3.5" fill="white" stroke="#77574d" strokeWidth="2" />
          <circle cx="210" cy="50" r="3.5" fill="white" stroke="#77574d" strokeWidth="2" />
          <circle cx="310" cy="18" r="6" fill="#77574d" />
        </svg>

        <div className="flex justify-between px-1 pt-1 text-xs text-on-surface-variant">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span className="font-semibold text-primary">Today</span>
        </div>
      </div>
    </section>
  );
}