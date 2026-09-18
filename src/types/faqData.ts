import type { HelpCategory } from "./helpData";

export const faqs: {
  category: HelpCategory;
  question: string;
  answer: string;
}[] = [
  {
    category: "Orders",
    question: "How do I track my order?",
    answer:
      "Once your order has been dispatched, you will receive a shipping confirmation email containing your tracking number.",
  },
  {
    category: "Payment",
    question: "Which payment methods do you accept?",
    answer:
      "You can choose a saved card, Apple Pay, PayPal, or Online Banking during checkout.",
  },
  {
    category: "Shipping",
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to over 50 countries worldwide.",
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for all unopened and unused products.",
  },
  {
    category: "Account",
    question: "How can I change my subscription?",
    answer:
      "You can manage your subscriptions directly through your account dashboard.",
  },
];