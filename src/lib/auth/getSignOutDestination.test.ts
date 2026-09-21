import { describe, expect, it } from "vitest";
import { getSignOutDestination } from "./getSignOutDestination";

describe("getSignOutDestination", () => {
  it("sends a signed-out admin back to login", () => {
    expect(getSignOutDestination()).toBe("/login");
  });
});