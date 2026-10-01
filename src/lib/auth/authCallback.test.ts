import { describe, expect, it } from "vitest";
import {
    getSafeAuthCallbackNext,
    getSafeAuthCallbackStoreSlug,
    getSafeLoginNotice,
} from "./authCallback";

describe("Google auth callback safety", () => {
    it("keeps a valid store slug", () => {
        expect(
            getSafeAuthCallbackStoreSlug(" Boutique-Demo-Store "),
        ).toBe("boutique-demo-store");
    });

    it("rejects an invalid store slug", () => {
        expect(getSafeAuthCallbackStoreSlug("wrong_slug")).toBeUndefined();
    });

    it("keeps an internal continuation path", () => {
        expect(
            getSafeAuthCallbackNext("/store/boutique-demo-store"),
        ).toBe("/store/boutique-demo-store");
    });

    it("rejects external continuation URLs", () => {
        expect(
            getSafeAuthCallbackNext("https://attacker.example"),
        ).toBe("/");
        expect(getSafeAuthCallbackNext("//attacker.example")).toBe("/");
        expect(getSafeAuthCallbackNext(null)).toBe("/");
    });
    it("shows only the known Google sign-in failure message", () => {
        expect(getSafeLoginNotice("google-sign-in-failed")).toBe(
            "Google sign-in could not be completed. Please try again.",
        );
        expect(getSafeLoginNotice("unexpected-error")).toBe("");
        expect(getSafeLoginNotice(null)).toBe("");
    });
});