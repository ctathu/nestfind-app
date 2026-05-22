import type { APIRequestContext, APIResponse } from "@playwright/test";

export type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

export type ListingsApiData = {
  listings: {
    id: string;
    title: string;
    location: string;
    category: string;
    pricePerNight: number;
    rating: number;
  }[];
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
};

export async function parseApiJson<T>(response: APIResponse): Promise<T> {
  const json = (await response.json()) as ApiEnvelope<T>;
  if (!json.success) {
    throw new Error(json.error?.message ?? "API request failed");
  }
  return json.data;
}

export async function getListings(
  request: APIRequestContext,
  query = "",
): Promise<ListingsApiData> {
  const path = query ? `/api/listings?${query}` : "/api/listings";
  const res = await request.get(path);
  return parseApiJson<ListingsApiData>(res);
}

export async function getListingById(
  request: APIRequestContext,
  id: string,
) {
  const res = await request.get(`/api/listings/${id}`);
  return { response: res, data: await res.json() };
}

export async function getHealth(request: APIRequestContext) {
  const res = await request.get("/api/health");
  return parseApiJson<{
    status: string;
    service: string;
    database: string;
  }>(res);
}

export type AiSearchApiData = {
  prompt: string;
  provider: string;
  intent: {
    city?: string;
    category?: string;
    guests?: number;
    maxPrice?: number;
    topRated?: boolean;
    summary: string;
    confidence: number;
  };
  validation: {
    passed: boolean;
    warnings: string[];
    usedFallback: boolean;
  };
  listings: ListingsApiData;
};

export async function postAiSearch(
  request: APIRequestContext,
  prompt: string,
  provider?: "RULES" | "OPENAI",
): Promise<AiSearchApiData> {
  const res = await request.post("/api/ai/search", {
    data: { prompt, provider },
  });
  if (!res.ok()) {
    const body = await res.json();
    throw new Error(
      (body as { error?: { message?: string } }).error?.message ??
        `AI search failed (${res.status()})`,
    );
  }
  return parseApiJson<AiSearchApiData>(res);
}

export type AiMetricsApiData = {
  windowHours: number;
  totalRequests: number;
  successRate: number;
  validationPassRate: number;
  fallbackRate: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  byProvider: { provider: string; requests: number; avgLatencyMs: number }[];
};

export async function getAiMetrics(
  request: APIRequestContext,
  windowHours = 24,
): Promise<AiMetricsApiData> {
  const res = await request.get(`/api/ai/metrics?windowHours=${windowHours}`);
  return parseApiJson<AiMetricsApiData>(res);
}
