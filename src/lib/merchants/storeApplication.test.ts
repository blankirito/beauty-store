import { describe, expect, it } from "vitest";
import {
  normalizeStoreSlug,
  validateStoreApplicationInput,
} from "./storeApplication";

describe("store application", () => {
  it("normalizes a store name into a URL slug", () => {
    expect(
      normalizeStoreSlug(" Aura Botanicals & Apothecary "),
    ).toBe("aura-botanicals-apothecary");
  });

  it("rejects a reserved store slug", () => {
    const result = validateStoreApplicationInput({
      name: "Aura Botanicals",
      slug: "admin",
      category: "Beauty",
      contactName: "Claire",
      phone: "+60 12-345 6789",
      description: "Natural beauty essentials.",
    });

    expect(result.fieldErrors.slug).toBeDefined();
  });

  it("requires the essential store application details", () => {
    const result = validateStoreApplicationInput({
      name: "",
      slug: "",
      category: "",
      contactName: "",
      phone: "",
      description: "",
    });

    expect(result.fieldErrors.name).toBeDefined();
    expect(result.fieldErrors.slug).toBeDefined();
    expect(result.fieldErrors.category).toBeDefined();
    expect(result.fieldErrors.contactName).toBeDefined();
    expect(result.fieldErrors.phone).toBeDefined();
    expect(result.fieldErrors.description).toBeDefined();
  });

  it("limits the store description to 240 characters", () => {
    const result = validateStoreApplicationInput({
      name: "Aura Botanicals",
      slug: "aura-botanicals",
      category: "Beauty",
      contactName: "Claire",
      phone: "+60 12-345 6789",
      description: "a".repeat(241),
    });

    expect(result.fieldErrors.description).toBeDefined();
  });
});