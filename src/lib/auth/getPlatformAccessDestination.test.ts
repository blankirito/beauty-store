import { describe, expect, it } from "vitest";
import { getPlatformAccessDestination } from "./getPlatformAccessDestination";

describe("platform access", () => {
  it("sends a signed-out visitor to login", () => {
    expect(getPlatformAccessDestination(false, false)).toBe("/login");
  });

  it("sends a signed-in merchant back to their admin portal", () => {
    expect(getPlatformAccessDestination(true, false)).toBe("/admin");
  });

  it("allows only the platform admin into platform management", () => {
    expect(getPlatformAccessDestination(true, true)).toBeNull();
  });
});