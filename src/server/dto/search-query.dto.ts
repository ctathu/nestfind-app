import { z } from "zod";
import { AppError } from "@/server/errors/app-error";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "Search query is required"),
  location: z.string().trim().optional(),
  city: z.string().trim().optional(),
  guests: z.coerce.number().int().positive().max(50).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type SearchQueryDto = z.infer<typeof searchQuerySchema>;

export function parseSearchQuery(searchParams: URLSearchParams): SearchQueryDto {
  const raw = Object.fromEntries(searchParams.entries());
  const parsed = searchQuerySchema.safeParse(raw);

  if (!parsed.success) {
    throw AppError.validation("Invalid search parameters", parsed.error.flatten());
  }

  return parsed.data;
}
