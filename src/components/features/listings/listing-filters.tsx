"use client";

import { CategoryChips } from "@/components/features/home/category-chips";
import { SearchBar } from "@/components/features/home/search-bar";
import type { CategoryFilter, SearchFilters } from "@/lib/filters";

type ListingFiltersProps = {
  filters: SearchFilters;
  onFiltersChange: (patch: Partial<SearchFilters>) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onSearch: (snapshot?: Partial<SearchFilters>) => void;
};

export function ListingFilters({
  filters,
  onFiltersChange,
  onCategoryChange,
  onSearch,
}: ListingFiltersProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 sm:p-6">
      <SearchBar
        filters={filters}
        onChange={onFiltersChange}
        onSearch={onSearch}
      />
      <CategoryChips value={filters.category} onChange={onCategoryChange} />
    </div>
  );
}
