import { describe, expect, it } from "vitest";
import {
  getDefaultStorefrontAddress,
  type StorefrontSavedAddress,
} from "./storefrontAddresses";

const homeAddress: StorefrontSavedAddress = {
  id: "home-address",
  label: "Home",
  recipientName: "Ava Tan",
  phone: "0123456789",
  addressLine1: "1 Jalan Demo",
  addressLine2: null,
  city: "Kuala Lumpur",
  state: "Kuala Lumpur",
  postalCode: "50000",
  country: "Malaysia",
  isDefault: true,
};

const workAddress: StorefrontSavedAddress = {
  ...homeAddress,
  id: "work-address",
  label: "Work",
  addressLine1: "99 Jalan Office",
  isDefault: false,
};

describe("getDefaultStorefrontAddress", () => {
  it("returns the customer's default address", () => {
    expect(
      getDefaultStorefrontAddress([workAddress, homeAddress]),
    ).toEqual(homeAddress);
  });

  it("returns null when the customer has no saved address", () => {
    expect(getDefaultStorefrontAddress([])).toBeNull();
  });
});