import { describe, expect, it } from "vitest";
import {
  toDatabaseProductStatus,
  toDisplayProductStatus,
} from "./productStatus";

describe("product status conversion", () => {
  it("converts the Active UI label to the active database value", () => {
    expect(toDatabaseProductStatus("Active")).toBe("active");
  });

  it("converts the archived database value to the Archived UI label", () => {
    expect(toDisplayProductStatus("archived")).toBe("Archived");
  });
});