import type { MerchantPlanCode } from "./merchantBilling";

export const MANUAL_PAYMENT_DURATIONS = [1, 3, 12] as const;

type ManualPaymentQuoteInput = {
  planCode: MerchantPlanCode;
  foundingPriceLockedUntil: string | null;
  months: number;
};

type DashboardBillingReminderInput = {
  status: string;
  currentPeriodEndsAt: string | null;
};

function isAllowedDuration(
  months: number,
): months is (typeof MANUAL_PAYMENT_DURATIONS)[number] {
  return MANUAL_PAYMENT_DURATIONS.includes(
    months as (typeof MANUAL_PAYMENT_DURATIONS)[number],
  );
}

function addCalendarMonths(date: Date, months: number) {
  const result = new Date(date);
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(
      result.getUTCFullYear(),
      result.getUTCMonth() + 1,
      0,
    ),
  ).getUTCDate();

  result.setUTCDate(Math.min(originalDay, lastDayOfTargetMonth));

  return result;
}

export function getManualPaymentQuote(
  input: ManualPaymentQuoteInput,
  now = new Date(),
) {
  if (!isAllowedDuration(input.months)) {
    throw new Error("Choose 1, 3, or 12 months.");
  }

  if (input.planCode === "lumina-monthly-complimentary") {
    throw new Error("Complimentary access does not require payment.");
  }

  const hasActiveFoundingPrice =
    input.planCode === "lumina-monthly-founding" &&
    input.foundingPriceLockedUntil !== null &&
    new Date(input.foundingPriceLockedUntil).getTime() > now.getTime();

  const monthlyPrice = hasActiveFoundingPrice ? 29 : 59;

  return {
    monthlyPrice,
    months: input.months,
    totalAmount: monthlyPrice * input.months,
  };
}

export function extendSubscriptionPeriod(
  currentPeriodEndsAt: string | null,
  months: number,
  now = new Date(),
) {
  if (!isAllowedDuration(months)) {
    throw new Error("Choose 1, 3, or 12 months.");
  }

  const currentPeriodEnd = currentPeriodEndsAt
    ? new Date(currentPeriodEndsAt)
    : null;

  const startsAt =
    currentPeriodEnd && currentPeriodEnd.getTime() > now.getTime()
      ? currentPeriodEnd
      : now;

  return addCalendarMonths(startsAt, months).toISOString();
}

export function shouldShowDashboardBillingReminder(
  input: DashboardBillingReminderInput,
  now = new Date(),
) {
  if (input.status !== "active") {
    return true;
  }

  if (!input.currentPeriodEndsAt) {
    return true;
  }

  const currentPeriodEnd = new Date(input.currentPeriodEndsAt);

  if (Number.isNaN(currentPeriodEnd.getTime())) {
    return true;
  }

  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  return (
    currentPeriodEnd.getTime() - now.getTime() <=
    sevenDaysInMilliseconds
  );
}

export function prepareManualPaymentRequest(formData: FormData) {
  const months = Number(formData.get("months"));
  const payerName = String(formData.get("payerName") ?? "").trim();
  const tngReference = String(formData.get("tngReference") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!isAllowedDuration(months)) {
    return {
      error: "Choose 1, 3, or 12 months.",
    };
  }

  if (!payerName) {
    return {
      error: "Enter the transfer payer name.",
    };
  }

  if (!tngReference) {
    return {
      error: "Enter the TNG transfer reference.",
    };
  }

  if (
    payerName.length > 120 ||
    tngReference.length > 120 ||
    note.length > 500
  ) {
    return {
      error: "One or more payment details are too long.",
    };
  }

  return {
    months,
    payerName,
    tngReference,
    note: note || null,
  };
}