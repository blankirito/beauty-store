import { describe, expect, it } from "vitest";
import { prepareStorefrontEmailUpdate } from "./storefrontEmail";

describe("prepareStorefrontEmailUpdate", () => {
  it("trims and accepts a new email with the current password", () => {
    expect(
      prepareStorefrontEmailUpdate({
        currentEmail: "bbb@gmail.com",
        newEmail: "  new-email@gmail.com  ",
        currentPassword: "CurrentPassword1!",
      }),
    ).toEqual({
      newEmail: "new-email@gmail.com",
      currentPassword: "CurrentPassword1!",
    });
  });

  it("rejects a new email that is the same as the current email", () => {
    expect(() =>
      prepareStorefrontEmailUpdate({
        currentEmail: "bbb@gmail.com",
        newEmail: " BBB@GMAIL.COM ",
        currentPassword: "CurrentPassword1!",
      }),
    ).toThrow("Enter a different email address.");
  });

  it("rejects an empty current password", () => {
    expect(() =>
      prepareStorefrontEmailUpdate({
        currentEmail: "bbb@gmail.com",
        newEmail: "new-email@gmail.com",
        currentPassword: "   ",
      }),
    ).toThrow("Enter your current password.");
  });
});