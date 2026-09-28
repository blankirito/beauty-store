export type ComplimentaryAccessDecision = "grant" | "remove";

export function getComplimentaryAccessChange(
  decision: ComplimentaryAccessDecision,
  now = new Date(),
) {
  if (decision === "grant") {
    return {
      planCode: "lumina-monthly-complimentary",
      subscriptionStatus: "complimentary",
      paymentGraceEndsAt: null,
    };
  }

  const paymentGraceEndsAt = new Date(now);
  paymentGraceEndsAt.setUTCDate(paymentGraceEndsAt.getUTCDate() + 7);

  return {
    planCode: "lumina-monthly",
    subscriptionStatus: "past_due",
    paymentGraceEndsAt: paymentGraceEndsAt.toISOString(),
  };
}