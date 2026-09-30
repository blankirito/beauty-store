import { describe, expect, it } from "vitest";
import { getLuminaCopyrightNotice } from "./copyrightNotice";

describe("Lumina copyright notice", () => {
  it("formats the public copyright notice", () => {
    expect(getLuminaCopyrightNotice(2026)).toBe(
      "© 2026 Lumina. All rights reserved.",
    );
  });
});