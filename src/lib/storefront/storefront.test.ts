import { describe, expect, it } from "vitest";
import { toStorefront } from "./storefront";

describe("storefront mapping", () => {
  it("maps only safe public store details", () => {
    const storefront = toStorefront({
      id: "store-uuid-1",
      name: "Boutique Demo Store",
      slug: "boutique-demo-store",
      description: "A curated beauty boutique.",
    });

    expect(storefront).toEqual({
      id: "store-uuid-1",
      name: "Boutique Demo Store",
      slug: "boutique-demo-store",
      description: "A curated beauty boutique.",
    });
  });

  it("keeps a missing store description empty", () => {
    const storefront = toStorefront({
      id: "store-uuid-1",
      name: "Boutique Demo Store",
      slug: "boutique-demo-store",
      description: null,
    });

    expect(storefront.description).toBe("");
  });
});