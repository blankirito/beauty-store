import { describe, expect, it } from "vitest";
import { getStoreApplicationMutation } from "./storeApplicationMutation";

describe("store application mutation", () => {
  it("creates an application when the merchant has none", () => {
    expect(getStoreApplicationMutation(null)).toEqual({
      type: "create",
    });
  });

  it("updates an editable draft or rejected application", () => {
    expect(getStoreApplicationMutation("draft")).toEqual({
      type: "update",
    });

    expect(getStoreApplicationMutation("rejected")).toEqual({
      type: "update",
    });
  });

  it("does not allow a submitted or active application to be changed", () => {
    expect(getStoreApplicationMutation("pending_review")).toEqual({
      type: "error",
      message: "This store application can no longer be edited.",
    });
  });
});