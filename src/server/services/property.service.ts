import { AppError } from "@/server/errors/app-error";
import type { ListingsQueryDto } from "@/server/dto/listings-query.dto";
import type { SearchQueryDto } from "@/server/dto/search-query.dto";
import {
  mapPropertiesToListings,
  mapPropertyToListing,
} from "@/server/mappers/property.mapper";
import { propertyRepository } from "@/server/repositories/property.repository";
import type { ListingsResult, Listing } from "@/types/listing";

export type PaginatedListings = ListingsResult & {
  hasMore: boolean;
};

function toPaginatedResult(
  listings: Listing[],
  total: number,
  limit: number,
  offset: number,
): PaginatedListings {
  return {
    listings,
    total,
    limit,
    offset,
    hasMore: offset + listings.length < total,
  };
}

export class PropertyService {
  async listProperties(query: ListingsQueryDto): Promise<PaginatedListings> {
    let effectiveQuery = { ...query };

    if (query.featured && !query.location && !query.city && !query.q) {
      effectiveQuery = { ...effectiveQuery, limit: Math.min(query.limit, 4) };
    }

    const { items, total } = await propertyRepository.findMany(effectiveQuery);
    const listings = mapPropertiesToListings(items);

    return toPaginatedResult(
      listings,
      total,
      effectiveQuery.limit,
      effectiveQuery.offset,
    );
  }

  async searchProperties(query: SearchQueryDto): Promise<PaginatedListings> {
    const { items, total } = await propertyRepository.search(query);
    const listings = mapPropertiesToListings(items);

    return toPaginatedResult(listings, total, query.limit, query.offset);
  }

  async getPropertyById(id: string): Promise<Listing> {
    const property = await propertyRepository.findById(id);

    if (!property) {
      throw AppError.notFound("Listing not found");
    }

    return mapPropertyToListing(property);
  }

  async getFilterOptions() {
    return propertyRepository.getFilterMetadata();
  }
}

export const propertyService = new PropertyService();
