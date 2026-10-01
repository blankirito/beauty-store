import { describe, expect, it } from "vitest";
import { legalLinks } from "./legalLinks";

describe("public legal links", () => {
    it("keeps the privacy and terms pages at stable public routes", () => {
        expect(legalLinks).toEqual({
            privacy: "/privacy",
            terms: "/terms",
        });
    });
});