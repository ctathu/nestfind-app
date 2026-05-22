"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api-client";
import type { StatsResult } from "@/types/listing";

export function useStats() {
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchApi<StatsResult>("/api/stats");
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setStats(null);
          setError(err instanceof Error ? err.message : "Failed to load stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
}
