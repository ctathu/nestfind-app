import { z } from "zod";
import { AppError } from "@/server/errors/app-error";

const listingCategorySchema = z.enum(["STUDIO", "APARTMENT", "HOUSE"]);

const booleanQuery = z
  .union([z.literal("true"), z.literal("false")])
  .transform((v) => v === "true");

export const listingsQuerySchema = z.object({
  location: z.string().trim().optional(),
  city: z.string().trim().optional(),
  q: z.string().trim().optional(),
  checkIn: z.string().trim().optional(),
  checkOut: z.string().trim().optional(),
  guests: z.coerce.number().int().positive().max(50).optional(),
  category: listingCategorySchema.optional(),
  topRated: booleanQuery.optional(),
  budgetFriendly: booleanQuery.optional(),
  featured: booleanQuery.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type ListingsQueryDto = z.infer<typeof listingsQuerySchema>;

export function parseListingsQuery(
  searchParams: URLSearchParams,
): ListingsQueryDto {
  const raw = Object.fromEntries(searchParams.entries());
  const parsed = listingsQuerySchema.safeParse(raw);

  if (!parsed.success) {
    throw AppError.validation("Invalid query parameters", parsed.error.flatten());
  }

  if (
    parsed.data.minPrice !== undefined &&
    parsed.data.maxPrice !== undefined &&
    parsed.data.minPrice > parsed.data.maxPrice
  ) {
    throw AppError.validation("minPrice cannot be greater than maxPrice");
  }

  return parsed.data;
}
