type StorePaymentMethodUpdateInput = {
  label: string;
  instructions: string;
  isEnabled: boolean;
};

type StorePaymentMethodUpdateResult =
  | {
      data: {
        label: string;
        instructions: string | null;
        isEnabled: boolean;
      };
    }
  | {
      error: string;
    };

export function prepareStorePaymentMethodUpdate(
  input: StorePaymentMethodUpdateInput,
): StorePaymentMethodUpdateResult {
  const label = input.label.trim();
  const instructions = input.instructions.trim();

  if (!label) {
    return {
      error: "Payment method name is required.",
    };
  }

  return {
    data: {
      label,
      instructions: instructions || null,
      isEnabled: input.isEnabled,
    },
  };
}