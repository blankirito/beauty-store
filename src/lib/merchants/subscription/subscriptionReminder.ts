type SubscriptionReminderInput = {
  status: string;
  trialDaysRemaining: number | null;
  trialEndsAt: string | null;
  currentPeriodEndsAt: string | null;
};

type SubscriptionReminderTone = "trial" | "active" | "warning" | "neutral";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getSubscriptionReminder(
  input: SubscriptionReminderInput,
): {
  title: string;
  description: string;
  actionLabel: string;
  tone: SubscriptionReminderTone;
} {
  if (input.status === "trialing") {
    const days = input.trialDaysRemaining ?? 0;

    return {
      title: `${days} day${days === 1 ? "" : "s"} left in your free trial`,
      description: input.trialEndsAt
        ? `Your free trial ends on ${formatDate(input.trialEndsAt)}.`
        : "Your free trial is currently active.",
      actionLabel: "View billing",
      tone: "trial",
    };
  }

  if (input.status === "past_due") {
    return {
      title: "Payment needs attention",
      description:
        "Review your billing details to keep your store available.",
      actionLabel: "View billing",
      tone: "warning",
    };
  }

  if (input.status === "suspended") {
    return {
      title: "Store subscription is paused",
      description:
        "Review your billing details to restore your store access.",
      actionLabel: "View billing",
      tone: "warning",
    };
  }

  if (input.status === "active") {
    return {
      title: "Your subscription is active",
      description: input.currentPeriodEndsAt
        ? `Current billing period ends ${formatDate(
            input.currentPeriodEndsAt,
          )}.`
        : "Your store subscription is currently active.",
      actionLabel: "View billing",
      tone: "active",
    };
  }

  return {
    title: "Subscription setup is coming soon",
    description:
      "You can review your plan and billing status at any time.",
    actionLabel: "View billing",
    tone: "neutral",
  };
}