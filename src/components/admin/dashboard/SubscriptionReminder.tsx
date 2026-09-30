import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, TriangleAlert } from "lucide-react";
import { getSubscriptionReminder } from "@/lib/merchants/subscription/subscriptionReminder";

type SubscriptionReminderProps = {
  billing: {
    status: string;
    trialDaysRemaining: number | null;
    trialEndsAt: string | null;
    currentPeriodEndsAt: string | null;
  } | null;
};

export default function SubscriptionReminder({
  billing,
}: SubscriptionReminderProps) {
  if (!billing) {
    return null;
  }

  const reminder = getSubscriptionReminder(billing);

  if (!reminder) {
    return null;
  }

  const presentation = {
    trial: {
      icon: Clock3,
      label: "Free trial",
      iconClass: "bg-secondary-container text-on-secondary-container",
      cardClass: "bg-surface-container-low",
    },
    active: {
      icon: BadgeCheck,
      label: "Subscription",
      iconClass: "bg-primary-container text-on-primary-container",
      cardClass: "bg-white border border-outline/10",
    },
    warning: {
      icon: TriangleAlert,
      label: "Action needed",
      iconClass: "bg-error-container text-error",
      cardClass: "bg-white border border-error/20",
    },
    neutral: {
      icon: Clock3,
      label: "Billing",
      iconClass: "bg-surface-container text-on-surface-variant",
      cardClass: "bg-white border border-outline/10",
    },
  }[reminder.tone];

  const Icon = presentation.icon;

  return (
    <section className={`rounded-2xl p-5 shadow-sm ${presentation.cardClass}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${presentation.iconClass}`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {presentation.label}
          </p>

          <h2 className="mt-1 font-display text-2xl text-on-surface">
            {reminder.title}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {reminder.description}
          </p>
        </div>
      </div>

      <Link
        href="/admin/billing"
        className="mt-4 flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:bg-on-primary-container"
      >
        {reminder.actionLabel}
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}