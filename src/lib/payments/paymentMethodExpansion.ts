export function getNextExpandedPaymentMethodId(
  currentPaymentMethodId: string | null,
  selectedPaymentMethodId: string,
): string | null {
  if (currentPaymentMethodId === selectedPaymentMethodId) {
    return null;
  }

  return selectedPaymentMethodId;
}