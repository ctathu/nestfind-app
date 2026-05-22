import type { AiSearchIntentRaw } from "@/server/ai/schemas/search-intent.schema";

const CITY_PATTERNS: { pattern: RegExp; city: string; label: string }[] = [
  { pattern: /\b(hanoi|ha\s*noi)\b/i, city: "hanoi", label: "Hanoi" },
  {
    pattern: /\b(ho\s*chi\s*minh|hcmc|saigon)\b/i,
    city: "ho-chi-minh-city",
    label: "Ho Chi Minh City",
  },
  { pattern: /\b(da\s*nang|danang)\b/i, city: "da-nang", label: "Da Nang" },
];

const CATEGORY_PATTERNS: {
  pattern: RegExp;
  category: "STUDIO" | "APARTMENT" | "HOUSE";
  label: string;
}[] = [
  { pattern: /\bstudio(s)?\b/i, category: "STUDIO", label: "studio" },
  { pattern: /\bapartment(s)?\b/i, category: "APARTMENT", label: "apartment" },
  { pattern: /\b(house|home|villa)(s)?\b/i, category: "HOUSE", label: "house" },
];

function extractGuests(prompt: string): number | undefined {
  const forGuests = prompt.match(/\bfor\s+(\d{1,2})\s*(guests?|people)?\b/i);
  if (forGuests) return Math.min(50, Number.parseInt(forGuests[1], 10));

  const guests = prompt.match(/\b(\d{1,2})\s*guests?\b/i);
  if (guests) return Math.min(50, Number.parseInt(guests[1], 10));

  return undefined;
}

function extractMaxPrice(prompt: string): number | undefined {
  const under = prompt.match(
    /\b(under|below|less than|max|maximum)\s*\$?\s*(\d{2,4})\b/i,
  );
  if (under) return Number.parseInt(under[2], 10);

  const perNight = prompt.match(/\b\$?\s*(\d{2,3})\s*(?:\/|per)\s*night\b/i);
  if (perNight) return Number.parseInt(perNight[1], 10);

  return undefined;
}

export function parseSearchIntentRules(prompt: string): AiSearchIntentRaw {
  const text = prompt.trim();
  const lower = text.toLowerCase();

  let city: string | undefined;
  let cityLabel: string | undefined;
  for (const { pattern, city: slug, label } of CITY_PATTERNS) {
    if (pattern.test(text)) {
      city = slug;
      cityLabel = label;
      break;
    }
  }

  let category: AiSearchIntentRaw["category"];
  let categoryLabel: string | undefined;
  for (const { pattern, category: cat, label } of CATEGORY_PATTERNS) {
    if (pattern.test(text)) {
      category = cat;
      categoryLabel = label;
      break;
    }
  }

  const guests = extractGuests(text);
  const maxPrice = extractMaxPrice(text);
  const budgetFriendly =
    /\b(budget|cheap|affordable|economy)\b/i.test(lower) || maxPrice !== undefined;
  const topRated = /\b(top[- ]?rated|best rated|highly rated)\b/i.test(lower);
  const featured = /\b(featured|popular|trending)\b/i.test(lower);

  const parts: string[] = [];
  if (cityLabel) parts.push(cityLabel);
  if (categoryLabel) parts.push(categoryLabel);
  if (guests) parts.push(`for ${guests} guests`);
  if (maxPrice) parts.push(`under $${maxPrice}/night`);
  if (budgetFriendly && !maxPrice) parts.push("budget-friendly");
  if (topRated) parts.push("top rated");
  if (featured) parts.push("featured");

  const summary =
    parts.length > 0
      ? `Searching for ${parts.join(", ")}.`
      : `Searching listings matching: "${text.slice(0, 80)}".`;

  let confidence = 0.55;
  if (city) confidence += 0.2;
  if (category) confidence += 0.1;
  if (guests || maxPrice || budgetFriendly || topRated) confidence += 0.1;
  confidence = Math.min(0.95, confidence);

  return {
    city,
    category,
    guests,
    maxPrice,
    budgetFriendly: budgetFriendly || undefined,
    topRated: topRated || undefined,
    featured: featured || undefined,
    keywords: !city && text.length > 0 ? text.slice(0, 200) : undefined,
    confidence,
    summary,
  };
}
