import type { AiSearchIntent } from "@/server/ai/schemas/search-intent.schema";
import {
  buildListingsQuery,
  type CategoryFilter,
  type SearchFilters,
} from "@/lib/filters";

const SLUG_TO_DISPLAY: Record<string, string> = {
  hanoi: "Hanoi",
  "ho-chi-minh-city": "Ho Chi Minh City",
  "da-nang": "Da Nang",
};

function categoryFromIntent(
  category?: AiSearchIntent["category"],
): CategoryFilter {
  switch (category) {
    case "STUDIO":
      return "studio";
    case "APARTMENT":
      return "apartment";
    case "HOUSE":
      return "house";
    default:
      return "all";
  }
}

export function intentToSearchFilters(intent: AiSearchIntent): SearchFilters {
  const location =
    intent.city && SLUG_TO_DISPLAY[intent.city]
      ? SLUG_TO_DISPLAY[intent.city]
      : (intent.location ?? "");

  let category = categoryFromIntent(intent.category);
  if (intent.topRated) category = "top-rated";
  if (intent.budgetFriendly && category === "all") category = "budget-friendly";

  return {
    location,
    checkIn: "",
    checkOut: "",
    guests: intent.guests ? String(intent.guests) : "2",
    category,
  };
}

export function intentToListingsUrl(intent: AiSearchIntent): string {
  const filters = intentToSearchFilters(intent);
  const params = buildListingsQuery(filters);

  if (intent.maxPrice !== undefined) {
    params.set("maxPrice", String(intent.maxPrice));
  }
  if (intent.minPrice !== undefined) {
    params.set("minPrice", String(intent.minPrice));
  }
  if (intent.featured) {
    params.set("featured", "true");
  }
  if (intent.keywords && !intent.city) {
    params.set("q", intent.keywords);
  }

  return `/listings?${params.toString()}`;
}
