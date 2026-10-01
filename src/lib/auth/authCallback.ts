export function getSafeAuthCallbackStoreSlug(
    value: string | null,
): string | undefined {
    const normalized = value?.trim().toLowerCase();

    if (!normalized) {
        return undefined;
    }

    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)
        ? normalized
        : undefined;
}

export function getSafeAuthCallbackNext(value: string | null): string {
    if (
        !value ||
        !value.startsWith("/") ||
        value.startsWith("//") ||
        value.includes("\\")
    ) {
        return "/";
    }

    return value;
}

export function getSafeLoginNotice(value: string | null): string {
    return value === "google-sign-in-failed"
        ? "Google sign-in could not be completed. Please try again."
        : "";
}