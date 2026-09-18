"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

export default function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: Props) {
  const contentId = useId();

  return (
    <div className="overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <h3 className="font-medium text-primary">{question}</h3>

        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          className="px-6 pb-6 leading-relaxed text-on-surface-variant"
        >
          {answer}
        </div>
      )}
    </div>
  );
}