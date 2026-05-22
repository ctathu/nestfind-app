import type { Prisma } from "@prisma/client";

export const propertyListingInclude = {
  city: true,
  district: true,
  propertyType: true,
  pricing: true,
  images: {
    where: { isPrimary: true },
    take: 1,
  },
} satisfies Prisma.PropertyInclude;

export type PropertyWithListingRelations = Prisma.PropertyGetPayload<{
  include: typeof propertyListingInclude;
}>;
