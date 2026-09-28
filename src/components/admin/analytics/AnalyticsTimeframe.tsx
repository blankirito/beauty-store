"use client";

import type {
  ReportingTimeframe,
} from "@/lib/admin/adminReporting";
import { CalendarDays } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type AnalyticsTimeframeProps = {
  timeframe: ReportingTimeframe;
  range: {
    start: string;
    end: string;
  };
};

const timeframeOptions: Array<{
  value: ReportingTimeframe;
  label: string;
}> = [
  { value: "7-days", label: "7 Days" },
  { value: "30-days", label: "30 Days" },
  { value: "this-month", label: "This Month" },
  { value: "this-year", label: "This Year" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatInclusiveEndDate(value: string) {
  const endDate = new Date(value);

  endDate.setUTCDate(endDate.getUTCDate() - 1);

  return formatDate(endDate.toISOString());
}

export default function AnalyticsTimeframe({
  timeframe,
  range,
}: AnalyticsTimeframeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectTimeframe(nextTimeframe: ReportingTimeframe) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("timeframe", nextTimeframe);

    router.push(`/admin/analytics?${params.toString()}`);
  }

  return (
    <section className="rounded-2xl border border-outline/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-on-surface">
        <CalendarDays size={18} className="text-primary" />
        Timeframe
      </div>

      <div className="mt-4 rounded-xl bg-surface-container-lowest px-3.5 py-3 text-sm text-on-surface shadow-sm">
        {formatDate(range.start)} – {formatInclusiveEndDate(range.end)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {timeframeOptions.map((option) => {
          const isActive = option.value === timeframe;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => selectTimeframe(option.value)}
              className={
                isActive
                  ? "rounded-xl bg-primary px-2 py-2.5 text-xs font-semibold text-on-primary"
                  : "rounded-xl bg-surface-container-lowest px-2 py-2.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
