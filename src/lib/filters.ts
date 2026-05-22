export type CategoryFilter =
  | "all"
  | "studio"
  | "apartment"
  | "house"
  | "top-rated"
  | "budget-friendly";

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  category: CategoryFilter;
}

export const DEFAULT_FILTERS: SearchFilters = {
  location: "",
  checkIn: "",
  checkOut: "",
  guests: "2",
  category: "all",
};

export function buildListingsQuery(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  const location = filters.location.trim();
  if (location) params.set("location", location);
  if (filters.checkIn) params.set("checkIn", filters.checkIn);
  if (filters.checkOut) params.set("checkOut", filters.checkOut);

  const guests = Number.parseInt(filters.guests, 10);
  if (Number.isFinite(guests) && guests > 0) params.set("guests", String(guests));

  switch (filters.category) {
    case "studio":
      params.set("category", "STUDIO");
      break;
    case "apartment":
      params.set("category", "APARTMENT");
      break;
    case "house":
      params.set("category", "HOUSE");
      break;
    case "top-rated":
      params.set("topRated", "true");
      break;
    case "budget-friendly":
      params.set("budgetFriendly", "true");
      break;
    default:
      break;
  }

  params.set("limit", "20");
  return params;
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return (
    filters.location.trim() !== "" ||
    filters.checkIn !== "" ||
    filters.checkOut !== "" ||
    filters.category !== "all"
  );
}

export function filtersFromSearchParams(
  searchParams: URLSearchParams,
): SearchFilters {
  const category = searchParams.get("category")?.toLowerCase();
  const categoryMap: Record<string, CategoryFilter> = {
    studio: "studio",
    apartment: "apartment",
    house: "house",
  };

  return {
    location: searchParams.get("location") ?? searchParams.get("city") ?? "",
    checkIn: searchParams.get("checkIn") ?? "",
    checkOut: searchParams.get("checkOut") ?? "",
    guests: searchParams.get("guests") ?? "2",
    category:
      searchParams.get("topRated") === "true"
        ? "top-rated"
        : searchParams.get("budgetFriendly") === "true"
          ? "budget-friendly"
          : category && category in categoryMap
            ? categoryMap[category]
            : "all",
  };
}
