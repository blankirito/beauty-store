export type DatabaseStorefrontPaymentMethod = {
  id: string;
  label: string;
  instructions: string;
  qr_image_path: string | null;
};

export type StorefrontPaymentMethod = {
  id: string;
  label: string;
  instructions: string;
  qrImagePath: string | null;
};

export function toStorefrontPaymentMethod(
  method: DatabaseStorefrontPaymentMethod,
): StorefrontPaymentMethod {
  return {
    id: method.id,
    label: method.label,
    instructions: method.instructions,
    qrImagePath: method.qr_image_path,
  };
}