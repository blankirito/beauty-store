type PlatformReviewInput = {
  decision: "approve" | "reject";
  reviewNote: string;
};

export function preparePlatformReview(input: PlatformReviewInput) {
  const reviewNote = input.reviewNote.trim();

  if (input.decision === "reject" && !reviewNote) {
    return {
      error: "A review note is required when requesting changes.",
    };
  }

  return {
    data: {
      decision: input.decision,
      reviewNote: reviewNote || null,
    },
  };
}