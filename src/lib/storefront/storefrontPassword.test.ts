import { describe, expect, it } from "vitest";
import { prepareStorefrontPasswordUpdate } from "./storefrontPassword";

describe("prepareStorefrontPasswordUpdate", () => {
    it("accepts a valid matching password update", () => {
        expect(
            prepareStorefrontPasswordUpdate({
                currentPassword: "OldPassword1!",
                newPassword: "NewPassword1!",
                confirmPassword: "NewPassword1!",
            }),
        ).toEqual({
            currentPassword: "OldPassword1!",
            newPassword: "NewPassword1!",
        });
    });

    it("rejects a password that does not meet requirements", () => {
        expect(() =>
            prepareStorefrontPasswordUpdate({
                currentPassword: "OldPassword1!",
                newPassword: "short",
                confirmPassword: "short",
            }),
        ).toThrow("Your new password does not meet all requirements.");
    });

    it("rejects non-matching new passwords", () => {
        expect(() =>
            prepareStorefrontPasswordUpdate({
                currentPassword: "OldPassword1!",
                newPassword: "NewPassword1!",
                confirmPassword: "DifferentPassword1!",
            }),
        ).toThrow("Your new passwords do not match.");
    });

    it("rejects an empty current password", () => {
        expect(() =>
            prepareStorefrontPasswordUpdate({
                currentPassword: "   ",
                newPassword: "NewPassword1!",
                confirmPassword: "NewPassword1!",
            }),
        ).toThrow("Enter your current password.");
    });
});