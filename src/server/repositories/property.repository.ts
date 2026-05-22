import type { Prisma } from "@prisma/client";
import { ListingStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import type { ListingsQueryDto } from "@/server/dto/listings-query.dto";
import type { SearchQueryDto } from "@/server/dto/search-query.dto";
import {
  propertyListingInclude,
  type PropertyWithListingRelations,
} from "@/server/repositories/property.include";

const BUDGET_MAX = 45;
const TOP_RATED_MIN = 4.5;

export type PropertyWhereInput = Prisma.PropertyWhereInput;

function activeListingsWhere(
  extra?: PropertyWhereInput,
): PropertyWhereInput {
  return {
    status: ListingStatus.ACTIVE,
    ...extra,
  };
}

function buildLocationFilter(
  location?: string,
  city?: string,
  q?: string,
): PropertyWhereInput | undefined {
  const needle = (location ?? city ?? q ?? "").trim();
  if (!needle) return undefined;

  return {
    OR: [
      { city: { name: { contains: needle, mode: "insensitive" } } },
      { city: { slug: { contains: needle, mode: "insensitive" } } },
      { district: { name: { contains: needle, mode: "insensitive" } } },
      { district: { slug: { contains: needle, mode: "insensitive" } } },
      { title: { contains: needle, mode: "insensitive" } },
      { description: { contains: needle, mode: "insensitive" } },
    ],
  };
}

function buildPricingFilter(query: ListingsQueryDto): PropertyWhereInput | undefined {
  const pricePerNight: Prisma.IntFilter = {};

  if (query.budgetFriendly) {
    pricePerNight.lte = BUDGET_MAX;
  }
  if (query.minPrice !== undefined) {
    pricePerNight.gte = query.minPrice;
  }
  if (query.maxPrice !== undefined) {
    pricePerNight.lte = query.maxPrice;
  }

  if (Object.keys(pricePerNight).length === 0) return undefined;
  return { pricing: { pricePerNight } };
}

function buildListingsWhere(query: ListingsQueryDto): PropertyWhereInput {
  const filters: PropertyWhereInput[] = [];

  const locationFilter = buildLocationFilter(
    query.location,
    query.city,
    query.q,
  );
  if (locationFilter) filters.push(locationFilter);

  if (query.guests) {
    filters.push({ maxGuests: { gte: query.guests } });
  }

  if (query.category) {
    filters.push({ propertyType: { code: query.category } });
  }

  if (query.topRated) {
    filters.push({ rating: { gte: TOP_RATED_MIN } });
  }

  if (query.featured) {
    filters.push({ featured: true });
  }

  if (query.minRating !== undefined) {
    filters.push({ rating: { gte: query.minRating } });
  }

  const pricingFilter = buildPricingFilter(query);
  if (pricingFilter) filters.push(pricingFilter);

  return activeListingsWhere(
    filters.length > 0 ? { AND: filters } : undefined,
  );
}

function buildSearchWhere(query: SearchQueryDto): PropertyWhereInput {
  const needle = query.q.trim();
  const locationNeedle = (query.location ?? query.city ?? "").trim();

  const conditions: PropertyWhereInput[] = [
    {
      OR: [
        { title: { contains: needle, mode: "insensitive" } },
        { description: { contains: needle, mode: "insensitive" } },
        { city: { name: { contains: needle, mode: "insensitive" } } },
        { district: { name: { contains: needle, mode: "insensitive" } } },
      ],
    },
  ];

  if (locationNeedle) {
    conditions.push({
      OR: [
        { city: { name: { contains: locationNeedle, mode: "insensitive" } } },
        { district: { name: { contains: locationNeedle, mode: "insensitive" } } },
      ],
    });
  }

  if (query.guests) {
    conditions.push({ maxGuests: { gte: query.guests } });
  }

  return activeListingsWhere({ AND: conditions });
}

const listingOrderBy: Prisma.PropertyOrderByWithRelationInput[] = [
  { featured: "desc" },
  { rating: "desc" },
  { createdAt: "desc" },
];

export class PropertyRepository {
  async findMany(
    query: ListingsQueryDto,
  ): Promise<{ items: PropertyWithListingRelations[]; total: number }> {
    const where = buildListingsWhere(query);

    const [items, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        include: propertyListingInclude,
        orderBy: listingOrderBy,
        take: query.limit,
        skip: query.offset,
      }),
      prisma.property.count({ where }),
    ]);

    return { items, total };
  }

  async search(
    query: SearchQueryDto,
  ): Promise<{ items: PropertyWithListingRelations[]; total: number }> {
    const where = buildSearchWhere(query);

    const [items, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        include: propertyListingInclude,
        orderBy: [{ rating: "desc" }, { pricing: { pricePerNight: "asc" } }],
        take: query.limit,
        skip: query.offset,
      }),
      prisma.property.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<PropertyWithListingRelations | null> {
    return prisma.property.findFirst({
      where: { id, status: ListingStatus.ACTIVE },
      include: propertyListingInclude,
    });
  }

  async getFilterMetadata() {
    const [cities, propertyTypes, priceAgg, ratingAgg, districts] =
      await Promise.all([
        prisma.city.findMany({
          where: { properties: { some: { status: ListingStatus.ACTIVE } } },
          select: { name: true },
          orderBy: { name: "asc" },
        }),
        prisma.propertyType.findMany({
          where: { properties: { some: { status: ListingStatus.ACTIVE } } },
          select: {
            code: true,
            _count: {
              select: {
                properties: { where: { status: ListingStatus.ACTIVE } },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.propertyPricing.aggregate({
          where: {
            property: { status: ListingStatus.ACTIVE },
          },
          _min: { pricePerNight: true },
          _max: { pricePerNight: true },
        }),
        prisma.property.aggregate({
          where: { status: ListingStatus.ACTIVE },
          _min: { rating: true },
          _max: { rating: true },
        }),
        prisma.district.findMany({
          where: {
            properties: { some: { status: ListingStatus.ACTIVE } },
          },
          select: { name: true, city: { select: { name: true } } },
          orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
        }),
      ]);

    return {
      locations: cities.map((c) => c.name),
      districts: districts.map((d) => ({
        name: d.name,
        city: d.city.name,
      })),
      categories: propertyTypes.map((t) => ({
        value: t.code,
        count: t._count.properties,
      })),
      priceRange: {
        min: priceAgg._min.pricePerNight ?? 0,
        max: priceAgg._max.pricePerNight ?? 0,
      },
      ratingRange: {
        min: ratingAgg._min.rating ? Number(ratingAgg._min.rating) : 0,
        max: ratingAgg._max.rating ? Number(ratingAgg._max.rating) : 5,
      },
      presets: {
        budgetFriendlyMax: BUDGET_MAX,
        topRatedMin: TOP_RATED_MIN,
      },
    };
  }

  async countAll() {
    return prisma.property.count({
      where: { status: ListingStatus.ACTIVE },
    });
  }

  async aggregateStats() {
    const [count, citiesCovered, avgPrice] = await Promise.all([
      prisma.property.count({
        where: { status: ListingStatus.ACTIVE },
      }),
      prisma.city.count({
        where: { properties: { some: { status: ListingStatus.ACTIVE } } },
      }),
      prisma.propertyPricing.aggregate({
        where: {
          property: { status: ListingStatus.ACTIVE },
        },
        _avg: { pricePerNight: true },
      }),
    ]);

    return {
      count,
      citiesCovered,
      avgPricePerNight: Math.round(avgPrice._avg.pricePerNight ?? 0),
    };
  }
}

export const propertyRepository = new PropertyRepository();
