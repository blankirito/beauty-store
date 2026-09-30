import { describe, expect, it } from "vitest";
import {
    getStoreProfileSaveError,
    prepareStoreProfileUpdate,
} from "./storeProfile";

describe("store profile", () => {
    it("normalizes the public store profile fields", () => {
        expect(
            prepareStoreProfileUpdate({
                name: "  Glow House  ",
                slug: " Glow-House ",
                description: "  Gentle skincare.  ",
            }),
        ).toEqual({
            name: "Glow House",
            slug: "glow-house",
            description: "Gentle skincare.",
        });
    });

    it("rejects a missing store name", () => {
        expect(() =>
            prepareStoreProfileUpdate({
                name: "   ",
                slug: "glow-house",
                description: "",
            }),
        ).toThrow("Enter your store name.");
    });

    it("rejects an invalid store URL", () => {
        expect(() =>
            prepareStoreProfileUpdate({
                name: "Glow House",
                slug: "glow_house",
                description: "",
            }),
        ).toThrow("Enter a valid store URL.");
    });

    it("stores a blank description as null", () => {
        expect(
            prepareStoreProfileUpdate({
                name: "Glow House",
                slug: "glow-house",
                description: "   ",
            }),
        ).toEqual({
            name: "Glow House",
            slug: "glow-house",
            description: null,
        });
    });
    it("rejects a store URL longer than 80 characters", () => {
        expect(() =>
            prepareStoreProfileUpdate({
                name: "Glow House",
                slug: "a".repeat(81),
                description: "",
            }),
        ).toThrow("Store URL must be 80 characters or less.");
    });

    it("rejects a description longer than 500 characters", () => {
        expect(() =>
            prepareStoreProfileUpdate({
                name: "Glow House",
                slug: "glow-house",
                description: "a".repeat(501),
            }),
        ).toThrow("Store description must be 500 characters or less.");
    });
    it("shows a clear error when the store URL is already taken", () => {
        expect(
            getStoreProfileSaveError({
                code: "23505",
                message: "duplicate key value violates unique constraint",
            }),
        ).toBe("That store URL is already in use.");
    });

    it("keeps an unexpected save error safe", () => {
        expect(
            getStoreProfileSaveError({
                code: "XX000",
                message: "database error",
            }),
        ).toBe("We could not save your store profile. Please try again.");
    });
    it("rejects a store name longer than 120 characters", () => {
        expect(() =>
            prepareStoreProfileUpdate({
                name: "a".repeat(121),
                slug: "glow-house",
                description: "",
            }),
        ).toThrow("Store name must be 120 characters or less.");
    });
});