"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import { ListingFilters } from "@/components/features/listings/listing-filters";
import { PropertyCard } from "@/components/features/listings/property-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/layout/container";
import {
  buildListingsQuery,
  filtersFromSearchParams,
  type CategoryFilter,
  type SearchFilters,
} from "@/lib/filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useListings } from "@/hooks/use-listings";

export function ListingsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => filtersFromSearchParams(searchParams),
    [searchParams],
  );

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const debouncedLocation = useDebouncedValue(filters.location, 350);

  const effectiveFilters = useMemo(
    () => ({ ...filters, location: debouncedLocation }),
    [filters, debouncedLocation],
  );

  const { listings, total, loading, error, refetch } = useListings(
    effectiveFilters,
    { featuredByDefault: false },
  );

  const patchFilters = useCallback((patch: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyToUrl = useCallback(
    (next: SearchFilters) => {
      const params = buildListingsQuery(next);
      router.replace(`/listings?${params.toString()}`);
    },
    [router],
  );

  const handleCategoryChange = useCallback(
    (category: CategoryFilter) => {
      const next = { ...filters, category };
      setFilters(next);
      applyToUrl(next);
    },
    [filters, applyToUrl],
  );

  const handleSearch = useCallback(
    (snapshot?: Partial<SearchFilters>) => {
      const next = { ...filters, ...snapshot };
      setFilters(next);
      applyToUrl(next);
      refetch();
    },
    [filters, applyToUrl, refetch],
  );

  const cityLabel = filters.location.trim() || "all cities";

  return (
    <>
      <Navbar />
      <main data-testid="listings-page" className="min-h-[60vh] pb-16">
        <section className="border-b border-zinc-100 bg-[var(--nestfind-hero)] py-10">
          <Container>
            <h1 className="text-2xl font-bold text-[#1e4d3b] sm:text-3xl">
              Search stays
            </h1>
            <p className="mt-2 text-[#2d6b52]">
              Browse {total > 0 ? total : ""} listings
              {cityLabel !== "all cities" ? ` in ${cityLabel}` : ""}
            </p>
          </Container>
        </section>

        <Container className="py-8">
          <ListingFilters
            filters={filters}
            onFiltersChange={patchFilters}
            onCategoryChange={handleCategoryChange}
            onSearch={handleSearch}
          />

          <div className="mt-8">
            {loading ? (
              <LoadingGrid count={6} className="sm:grid-cols-2 lg:grid-cols-3" />
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : listings.length === 0 ? (
              <EmptyState
                title="No matches"
                description="Broaden your search or try a different property type."
              />
            ) : (
              <div
                data-testid="listings-grid"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {listings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    listing={listing}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
