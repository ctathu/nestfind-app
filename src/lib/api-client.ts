import {
  unwrapData,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "@/server/lib/api-response";

export async function fetchApi<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const payload = await res.json();

  if (!res.ok) {
    const err = payload as ApiErrorResponse;
    throw new Error(err.error?.message ?? "Request failed");
  }

  return unwrapData<T>(payload) as T;
}

export type { ApiSuccessResponse, ApiErrorResponse };
