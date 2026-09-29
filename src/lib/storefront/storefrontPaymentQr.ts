import { getPublicPaymentQrUrl } from "../payments/paymentQrCode";

export const PAYMENT_QR_GUIDANCE =
  "Scan to pay before placing your order. Your order will be confirmed after the store verifies payment.";

type StorefrontPaymentQrViewInput = {
  supabaseUrl: string;
  qrImagePath: string | null;
};

type StorefrontPaymentQrView = {
  imageUrl: string;
  guidance: string;
};

export function getStorefrontPaymentQrView({
  supabaseUrl,
  qrImagePath,
}: StorefrontPaymentQrViewInput): StorefrontPaymentQrView | null {
  if (!qrImagePath) {
    return null;
  }

  return {
    imageUrl: getPublicPaymentQrUrl(supabaseUrl, qrImagePath),
    guidance: PAYMENT_QR_GUIDANCE,
  };
}