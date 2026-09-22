type NewStorePaymentMethodInput = {
  label: string;
  instructions: string;
};

type NewStorePaymentMethodResult =
  | {
      data: {
        label: string;
        instructions: string | null;
        isEnabled: true;
      };
    }
  | {
      error: string;
    };

export function prepareNewStorePaymentMethod(
  input: NewStorePaymentMethodInput,
): NewStorePaymentMethodResult {
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
      isEnabled: true,
    },
  };
}