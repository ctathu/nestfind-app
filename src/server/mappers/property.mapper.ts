import type { Listing, ListingCategory } from "@/types/listing";
import type { PropertyWithListingRelations } from "@/server/repositories/property.include";

function toNumber(value: { toNumber(): number } | number): number {
  return typeof value === "number" ? value : value.toNumber();
}

export function mapPropertyToListing(
  property: PropertyWithListingRelations,
): Listing {
  const primaryImage =
    property.images[0]?.url ??
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

  return {
    id: property.id,
    title: property.title,
    description: property.description,
    location: property.city.name,
    district: property.district?.name ?? null,
    beds: property.beds,
    baths: property.baths,
    pricePerNight: property.pricing?.pricePerNight ?? 0,
    rating: toNumber(property.rating),
    imageUrl: primaryImage,
    category: property.propertyType.code as ListingCategory,
    isNew: property.isNew,
    isTopPick: property.isTopPick,
    maxGuests: property.maxGuests,
    featured: property.featured,
    cardAccent: property.cardAccent ?? undefined,
  };
}

export function mapPropertiesToListings(
  properties: PropertyWithListingRelations[],
): Listing[] {
  return properties.map(mapPropertyToListing);
}
