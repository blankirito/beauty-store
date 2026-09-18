"use client";

import { useState } from "react";
import type { HelpCategory } from "@/types/helpData";
import HelpHeader from "./HelpHeader";
import SearchBar from "./SearchBar";
import CategoryGrid from "./CategoryGrid";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";

export default function HelpCenterClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<HelpCategory | null>(
    null,
  );

  return (
    <div className="mx-auto max-w-[1100px] space-y-10">
      <HelpHeader />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <CategoryGrid
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <FAQSection
        searchQuery={searchQuery}
        activeCategory={activeCategory}
      />

      <ContactSection />
    </div>
  );
}