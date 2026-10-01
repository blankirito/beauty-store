export function getGuestTrackingLink(
    storeSlug: string,
    orderNumber: string,
    trackingToken: string,
): string {
    return `/store/${storeSlug}/orders/${orderNumber}?token=${encodeURIComponent(
        trackingToken,
    )}`;
}