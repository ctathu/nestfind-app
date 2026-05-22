"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { FeaturedListings } from "@/components/features/home/featured-listings";
import { HeroSection } from "@/components/features/home/hero-section";
import { MapCTA } from "@/components/features/home/map-cta";
import { StatsSection } from "@/components/features/home/stats-section";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import {
  buildListingsQuery,
  DEFAULT_FILTERS,
  type CategoryFilter,
  type SearchFilters,
} from "@/lib/filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useListings } from "@/hooks/use-listings";

export function HomePageClient() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const debouncedLocation = useDebouncedValue(filters.location, 350);

  const effectiveFilters = useMemo(
    () => ({ ...filters, location: debouncedLocation }),
    [filters, debouncedLocation],
  );

  const { listings, total, loading, error, refetch } = useListings(
    effectiveFilters,
    { featuredByDefault: true },
  );

  const patchFilters = useCallback((patch: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleCategoryChange = useCallback((category: CategoryFilter) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const handleSearch = useCallback(
    (snapshot?: Partial<SearchFilters>) => {
      const params = buildListingsQuery({ ...filters, ...snapshot });
      router.push(`/listings?${params.toString()}`);
    },
    [filters, router],
  );

  return (
    <>
      <Navbar />
      <main data-testid="home-page">
        <HeroSection
          filters={filters}
          onFiltersChange={patchFilters}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />
        <StatsSection />
        <FeaturedListings
          listings={listings}
          total={total}
          loading={loading}
          error={error}
          filters={effectiveFilters}
          onRetry={refetch}
        />
        <MapCTA listings={listings} />
      </main>
      <Footer />
    </>
  );
}
