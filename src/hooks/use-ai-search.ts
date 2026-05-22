"use client";

import { useCallback, useState } from "react";
import { fetchApi } from "@/lib/api-client";
import type { AiSearchIntent } from "@/server/ai/schemas/search-intent.schema";
import type { PaginatedListings } from "@/server/services/property.service";
import type { AiProviderName } from "@/server/ai/providers";

export type AiSearchResult = {
  prompt: string;
  provider: AiProviderName;
  intent: AiSearchIntent;
  validation: {
    passed: boolean;
    warnings: string[];
    usedFallback: boolean;
  };
  listings: PaginatedListings;
};

type UseAiSearchState = {
  loading: boolean;
  error: string | null;
  result: AiSearchResult | null;
};

export function useAiSearch() {
  const [state, setState] = useState<UseAiSearchState>({
    loading: false,
    error: null,
    result: null,
  });

  const search = useCallback(async (prompt: string, provider?: AiProviderName) => {
    setState({ loading: true, error: null, result: null });

    try {
      const result = await fetchApi<AiSearchResult>("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, provider }),
      });
      setState({ loading: false, error: null, result });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI search failed";
      setState({ loading: false, error: message, result: null });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  return { ...state, search, reset };
}
