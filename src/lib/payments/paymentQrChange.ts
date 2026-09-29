type PaymentQrImageChangeInput = {
  currentQrImagePath: string | null;
  replacementQrImagePath: string | null;
  removeQr: boolean;
};

type PaymentQrImageChange = {
  qrImagePath: string | null;
  obsoleteQrImagePath: string | null;
};

export function getPaymentQrImageChange({
  currentQrImagePath,
  replacementQrImagePath,
  removeQr,
}: PaymentQrImageChangeInput): PaymentQrImageChange {
  if (replacementQrImagePath) {
    return {
      qrImagePath: replacementQrImagePath,
      obsoleteQrImagePath: currentQrImagePath,
    };
  }

  if (removeQr) {
    return {
      qrImagePath: null,
      obsoleteQrImagePath: currentQrImagePath,
    };
  }

  return {
    qrImagePath: currentQrImagePath,
    obsoleteQrImagePath: null,
  };
}