import { describe, expect, it } from "vitest";
import { toAdminStoreContext } from "./getAdminStoreContext";

describe("admin store context", () => {
  it("maps the current owner and store into display context", () => {
    expect(
      toAdminStoreContext({
        storeName: "Boutique Store",
        profileName: "Lee Chongyu",
        role: "owner",
      }),
    ).toEqual({
      storeName: "Boutique Store",
      memberName: "Lee Chongyu",
      roleLabel: "Owner",
    });
  });

  it("maps an admin role and falls back safely when profile name is blank", () => {
    expect(
      toAdminStoreContext({
        storeName: "Glow House",
        profileName: "   ",
        role: "admin",
      }),
    ).toEqual({
      storeName: "Glow House",
      memberName: "Account",
      roleLabel: "Admin",
    });
  });
});