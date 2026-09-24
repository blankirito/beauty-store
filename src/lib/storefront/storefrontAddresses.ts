export type StorefrontSavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export function getDefaultStorefrontAddress(
  addresses: StorefrontSavedAddress[],
): StorefrontSavedAddress | null {
  return addresses.find((address) => address.isDefault) ?? null;
}