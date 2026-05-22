import { z } from "zod";

export const listingCategorySchema = z.enum(["STUDIO", "APARTMENT", "HOUSE"]);

/** Raw shape returned by AI providers before domain validation. */
export const aiSearchIntentRawSchema = z.object({
  location: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  category: listingCategorySchema.optional(),
  guests: z.number().int().positive().max(50).optional(),
  minPrice: z.number().nonnegative().max(10_000).optional(),
  maxPrice: z.number().positive().max(10_000).optional(),
  topRated: z.boolean().optional(),
  budgetFriendly: z.boolean().optional(),
  featured: z.boolean().optional(),
  keywords: z.string().trim().max(200).optional(),
  confidence: z.number().min(0).max(1),
  summary: z.string().trim().min(1).max(500),
});

export type AiSearchIntentRaw = z.infer<typeof aiSearchIntentRawSchema>;

/** Sanitized intent safe to drive listing queries. */
export const aiSearchIntentSchema = aiSearchIntentRawSchema.extend({
  confidence: z.number().min(0).max(1),
});

export type AiSearchIntent = z.infer<typeof aiSearchIntentSchema>;
