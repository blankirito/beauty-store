import { describe, expect, it } from "vitest";
import { getWhatsAppSupportHref } from "./whatsAppSupport";

describe("WhatsApp sign-in support", () => {
    it("creates a generic sign-in support link", () => {
        expect(getWhatsAppSupportHref("60123456789")).toBe(
            "https://wa.me/60123456789?text=Hi%2C%20I%20need%20help%20signing%20in%20to%20Lumina.",
        );
    });

    it("returns null when support is not configured", () => {
        expect(getWhatsAppSupportHref(undefined)).toBeNull();
        expect(getWhatsAppSupportHref("")).toBeNull();
    });

    it("rejects a support number with non-digit characters", () => {
        expect(getWhatsAppSupportHref("+60 123456789")).toBeNull();
    });
});