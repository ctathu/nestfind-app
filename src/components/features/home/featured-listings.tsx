"use client";

import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PropertyCard } from "@/components/features/listings/property-card";
import { Container } from "@/components/layout/container";
import { hasActiveFilters, type SearchFilters } from "@/lib/filters";
import type { Listing } from "@/types/listing";

type FeaturedListingsProps = {
  listings: Listing[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  onRetry?: () => void;
};

export function FeaturedListings({
  listings,
  total,
  loading,
  error,
  filters,
  onRetry,
}: FeaturedListingsProps) {
  const active = hasActiveFilters(filters);
  const cityLabel = filters.location.trim() || "Hanoi";
  const title = active
    ? `${total} listing${total === 1 ? "" : "s"} found`
    : `Featured in ${cityLabel}`;

  return (
    <section data-testid="featured-listings" className="pb-12">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
          {!active ? (
            <Link
              href={`/listings?location=${encodeURIComponent(cityLabel)}`}
              className="shrink-0 text-sm font-semibold text-[var(--nestfind-green)] hover:underline"
            >
              See all →
            </Link>
          ) : null}
        </div>

        {loading ? (
          <LoadingGrid />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : listings.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            data-testid="featured-listings-grid"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {listings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
