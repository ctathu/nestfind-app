import type { Listing } from "@/types/listing";

export function formatPrice(price: number): string {
  return `$${price}`;
}

export function formatSpecs(listing: Listing): string {
  const location = listing.district
    ? `${listing.location} · ${listing.district}`
    : listing.location;

  if (listing.beds === 0) {
    return `${location} · Studio · ${listing.baths} bath${listing.baths === 1 ? "" : "s"}`;
  }

  return `${location} · ${listing.beds} bed${listing.beds === 1 ? "" : "s"} · ${listing.baths} bath${listing.baths === 1 ? "" : "s"}`;
}
