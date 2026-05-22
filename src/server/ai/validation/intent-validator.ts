import type { ListingsQueryDto } from "@/server/dto/listings-query.dto";
import {
  aiSearchIntentRawSchema,
  type AiSearchIntent,
  type AiSearchIntentRaw,
} from "@/server/ai/schemas/search-intent.schema";

const KNOWN_CITY_SLUGS = new Set([
  "hanoi",
  "ho-chi-minh-city",
  "da-nang",
]);

const CITY_ALIASES: Record<string, string> = {
  hanoi: "hanoi",
  "ha noi": "hanoi",
  "ho chi minh": "ho-chi-minh-city",
  "ho chi minh city": "ho-chi-minh-city",
  hcmc: "ho-chi-minh-city",
  saigon: "ho-chi-minh-city",
  "da nang": "da-nang",
  danang: "da-nang",
};

const MAX_PRICE = 500;
const MIN_CONFIDENCE_FOR_AUTO = 0.35;

export type IntentValidationResult =
  | { ok: true; intent: AiSearchIntent; warnings: string[] }
  | { ok: false; errors: string[]; partial?: Partial<AiSearchIntentRaw> };

function normalizeCity(input?: string): string | undefined {
  if (!input?.trim()) return undefined;
  const key = input.trim().toLowerCase();
  const slug = CITY_ALIASES[key] ?? key.replace(/\s+/g, "-");
  return KNOWN_CITY_SLUGS.has(slug) ? slug : undefined;
}

function clampPrice(value: number | undefined, max = MAX_PRICE): number | undefined {
  if (value === undefined) return undefined;
  return Math.min(Math.max(0, Math.round(value)), max);
}

export function validateAiSearchIntent(
  raw: unknown,
): IntentValidationResult {
  const parsed = aiSearchIntentRawSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }

  const warnings: string[] = [];
  const data = parsed.data;

  const city = normalizeCity(data.city ?? data.location);
  if ((data.city || data.location) && !city) {
    warnings.push("Unknown city; location filter omitted");
  }

  let minPrice = clampPrice(data.minPrice);
  let maxPrice = clampPrice(data.maxPrice);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    warnings.push("minPrice > maxPrice; swapped bounds");
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const confidence = data.confidence;
  if (confidence < MIN_CONFIDENCE_FOR_AUTO) {
    warnings.push("Low confidence; results may be broad");
  }

  const intent: AiSearchIntent = {
    ...data,
    city,
    location: city ? undefined : data.location?.trim().slice(0, 120),
    minPrice,
    maxPrice,
    confidence,
    summary: data.summary.slice(0, 500),
  };

  if (intent.budgetFriendly && intent.maxPrice === undefined) {
    intent.maxPrice = 45;
  }

  return { ok: true, intent, warnings };
}

export function intentToListingsQuery(
  intent: AiSearchIntent,
  limit = 12,
): ListingsQueryDto {
  return {
    city: intent.city,
    location: intent.city ? undefined : intent.location,
    q: intent.keywords,
    guests: intent.guests,
    category: intent.category,
    topRated: intent.topRated,
    budgetFriendly: intent.budgetFriendly,
    featured: intent.featured,
    minPrice: intent.minPrice,
    maxPrice: intent.maxPrice,
    limit,
    offset: 0,
  };
}
