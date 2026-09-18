"use client";

import { useMemo, useState } from "react";
import FAQItem from "./FAQItem";
import { faqs } from "@/types/faqData";
import type { HelpCategory } from "@/types/helpData";

type FAQSectionProps = {
  searchQuery: string;
  activeCategory: HelpCategory | null;
};

export default function FAQSection({
  searchQuery,
  activeCategory,
}: FAQSectionProps) {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const matchedFaqs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === null || faq.category === activeCategory;

      const matchesSearch =
        normalizedQuery.length === 0 ||
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const displayedFaqs = showAll ? matchedFaqs : matchedFaqs.slice(0, 3);

  return (
    <section className="space-y-4">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-primary">
            Common Questions
          </h2>

          {activeCategory && (
            <p className="mt-2 text-sm text-on-surface-variant">
              Showing {activeCategory} questions
            </p>
          )}
        </div>

        <span className="text-sm text-on-surface-variant">
          {matchedFaqs.length} found
        </span>
      </div>

      {displayedFaqs.length > 0 ? (
        displayedFaqs.map((faq) => (
          <FAQItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
            isOpen={activeQuestion === faq.question}
            onClick={() =>
              setActiveQuestion((current) =>
                current === faq.question ? null : faq.question,
              )
            }
          />
        ))
      ) : (
        <div className="rounded-xl border border-outline/20 bg-surface-container-lowest p-6 text-center">
          <p className="font-medium text-on-surface">No FAQs found</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Try another search term or select a different category.
          </p>
        </div>
      )}

      {matchedFaqs.length > 3 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="text-primary transition hover:underline"
          >
            {showAll ? "Show Fewer FAQs" : "View All FAQs"}
          </button>
        </div>
      )}
    </section>
  );
}