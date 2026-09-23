import { describe, expect, it } from "vitest";
import { preparePlatformReview } from "./platformReview";

describe("platform review", () => {
  it("prepares an approval without a review note", () => {
    expect(
      preparePlatformReview({
        decision: "approve",
        reviewNote: "",
      }),
    ).toEqual({
      data: {
        decision: "approve",
        reviewNote: null,
      },
    });
  });

  it("requires a review note when requesting changes", () => {
    expect(
      preparePlatformReview({
        decision: "reject",
        reviewNote: "   ",
      }),
    ).toEqual({
      error: "A review note is required when requesting changes.",
    });
  });

  it("trims the review note before requesting changes", () => {
    expect(
      preparePlatformReview({
        decision: "reject",
        reviewNote: "  Please add more store details.  ",
      }),
    ).toEqual({
      data: {
        decision: "reject",
        reviewNote: "Please add more store details.",
      },
    });
  });
});