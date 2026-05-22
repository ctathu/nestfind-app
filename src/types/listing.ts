export type ListingCategory = "STUDIO" | "APARTMENT" | "HOUSE";

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  district: string | null;
  beds: number;
  baths: number;
  pricePerNight: number;
  rating: number;
  imageUrl: string;
  category: ListingCategory;
  isNew: boolean;
  isTopPick: boolean;
  maxGuests: number;
  featured?: boolean;
  /** Pastel hero card accent from mockup */
  cardAccent?: "blue" | "green" | "yellow" | "pink";
}

export interface ListingsResult {
  listings: Listing[];
  total: number;
  limit: number;
  offset: number;
}

export interface StatsResult {
  activeListings: number;
  activeListingsDisplay: string;
  citiesCovered: number;
  avgPricePerNight: number;
  currency: "USD";
}

/** @deprecated Use ApiErrorResponse from api-response envelope */
export interface ApiError {
  error: string;
  code?: string;
}

export interface ListingsApiData extends ListingsResult {
  hasMore?: boolean;
}
