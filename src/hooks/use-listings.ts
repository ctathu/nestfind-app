"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildListingsQuery,
  DEFAULT_FILTERS,
  hasActiveFilters,
  type SearchFilters,
} from "@/lib/filters";
import { fetchApi } from "@/lib/api-client";
import type { Listing, ListingsResult } from "@/types/listing";

type UseListingsOptions = {
  /** When true, default fetch shows Hanoi featured (4 cards) */
  featuredByDefault?: boolean;
};

export function useListings(
  filters: SearchFilters,
  options: UseListingsOptions = { featuredByDefault: true },
) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const fetchListings = useCallback(
    async (nextFilters: SearchFilters) => {
      const id = ++requestId.current;
      setLoading(true);
      setError(null);

      try {
        const params = buildListingsQuery(nextFilters);
        const active = hasActiveFilters(nextFilters);

        if (
          options.featuredByDefault &&
          !active &&
          !nextFilters.location.trim()
        ) {
          params.set("location", "Hanoi");
          params.set("featured", "true");
          params.set("limit", "4");
        }

        const data = await fetchApi<ListingsResult>(
          `/api/listings?${params.toString()}`,
        );
        if (id !== requestId.current) return;

        setListings(data.listings ?? []);
        setTotal(data.total ?? 0);
      } catch (err) {
        if (id !== requestId.current) return;
        setListings([]);
        setTotal(0);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [options.featuredByDefault],
  );

  useEffect(() => {
    fetchListings(filters);
  }, [filters, fetchListings]);

  return {
    listings,
    total,
    loading,
    error,
    refetch: () => fetchListings(filters),
    reset: () => fetchListings(DEFAULT_FILTERS),
  };
}
