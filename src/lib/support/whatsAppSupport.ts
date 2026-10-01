const signInSupportMessage =
    "Hi, I need help signing in to Lumina.";

export function getWhatsAppSupportHref(
    phoneNumber: string | undefined,
): string | null {
    if (!phoneNumber || !/^[1-9]\d{7,14}$/.test(phoneNumber)) {
        return null;
    }

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        signInSupportMessage,
    )}`;
}