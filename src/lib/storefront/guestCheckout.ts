type GuestCheckoutItemInput = {
  productId: string;
  quantity: number;
  price?: number;
};

type GuestCheckoutInput = {
  storeSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethodId: string;
  items: GuestCheckoutItemInput[];
};

export type GuestCheckoutRequest = {
  storeSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethodId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

function requiredValue(value: string, errorMessage: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(errorMessage);
  }

  return trimmedValue;
}

export function prepareGuestCheckoutRequest(
  input: GuestCheckoutInput,
): GuestCheckoutRequest {
  const customerName = requiredValue(input.customerName, "Enter your name.");
  const customerEmail = requiredValue(
    input.customerEmail,
    "Enter your email.",
  );
  const customerPhone = requiredValue(
    input.customerPhone,
    "Enter your phone number.",
  );
  const addressLine1 = requiredValue(
    input.addressLine1,
    "Enter your address.",
  );
  const city = requiredValue(input.city, "Enter your city.");
  const state = requiredValue(input.state, "Enter your state.");
  const postalCode = requiredValue(
    input.postalCode,
    "Enter your postal code.",
  );
  const country = requiredValue(input.country, "Enter your country.");
  const paymentMethodId = requiredValue(
    input.paymentMethodId,
    "Choose a payment method.",
  );

  if (!customerEmail.includes("@")) {
    throw new Error("Enter a valid email.");
  }

  if (input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const items = input.items.map((item) => {
    if (!item.productId || item.quantity <= 0) {
      throw new Error("Your cart contains an invalid item.");
    }

    return {
      productId: item.productId,
      quantity: item.quantity,
    };
  });

  return {
    storeSlug: requiredValue(input.storeSlug, "Store not found.").toLowerCase(),
    customerName,
    customerEmail,
    customerPhone,
    addressLine1,
    addressLine2: input.addressLine2.trim(),
    city,
    state,
    postalCode,
    country,
    paymentMethodId,
    items,
  };
}