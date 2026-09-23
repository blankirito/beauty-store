import { describe, expect, it } from "vitest";
import { getSignOutDestination } from "./getSignOutDestination";

describe("getSignOutDestination", () => {
  it("sends a signed-out admin back to login", () => {
    expect(getSignOutDestination()).toBe("/login");
  });
  it("returns a shopper to their current store after signing out", () => {
  expect(getSignOutDestination("boutique-demo-store")).toBe(
    "/store/boutique-demo-store",
  );
});
});