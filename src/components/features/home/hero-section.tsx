"use client";

import { AiSearchAssistant } from "@/components/features/ai/ai-search-assistant";
import { CategoryChips } from "@/components/features/home/category-chips";
import { SearchBar } from "@/components/features/home/search-bar";
import { Container } from "@/components/layout/container";
import type { CategoryFilter, SearchFilters } from "@/lib/filters";

type HeroSectionProps = {
  filters: SearchFilters;
  onFiltersChange: (patch: Partial<SearchFilters>) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onSearch: (snapshot?: Partial<SearchFilters>) => void;
};

export function HeroSection({
  filters,
  onFiltersChange,
  onCategoryChange,
  onSearch,
}: HeroSectionProps) {
  return (
    <section data-testid="hero-section" className="bg-[var(--nestfind-hero)] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
      <Container className="max-w-5xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#1e4d3b] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Find your perfect stay
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#2d6b52] sm:text-lg">
          Thousands of apartments, studios, and homes across Vietnam and beyond
        </p>

        <div className="mt-8">
          <SearchBar
            filters={filters}
            onChange={onFiltersChange}
            onSearch={onSearch}
          />
        </div>

        <AiSearchAssistant />

        <div className="mt-6">
          <CategoryChips value={filters.category} onChange={onCategoryChange} />
        </div>
      </Container>
    </section>
  );
}
