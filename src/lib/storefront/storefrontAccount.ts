type StorefrontAccountUpdateInput = {
  fullName: string;
  phone: string;
};

type StorefrontAccountUpdate = {
  fullName: string;
  phone: string;
};

export function prepareStorefrontAccountUpdate(
  input: StorefrontAccountUpdateInput,
): StorefrontAccountUpdate {
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();

  if (!fullName) {
    throw new Error("Enter your full name.");
  }

  return {
    fullName,
    phone,
  };
}