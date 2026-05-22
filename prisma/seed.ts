import {
  PrismaClient,
  ListingStatus,
  CardAccent,
  type Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

const PROPERTY_TYPES = [
  { code: "STUDIO", name: "Studio", sortOrder: 1 },
  { code: "APARTMENT", name: "Apartment", sortOrder: 2 },
  { code: "HOUSE", name: "House", sortOrder: 3 },
] as const;

const CITIES = [
  { name: "Hanoi", slug: "hanoi" },
  { name: "Ho Chi Minh City", slug: "ho-chi-minh-city" },
  { name: "Da Nang", slug: "da-nang" },
] as const;

type SeedProperty = {
  title: string;
  description: string;
  citySlug: string;
  districtSlug: string;
  districtName: string;
  typeCode: (typeof PROPERTY_TYPES)[number]["code"];
  beds: number;
  baths: number;
  maxGuests: number;
  pricePerNight: number;
  rating: number;
  imageUrl: string;
  imageAlt?: string;
  isNew?: boolean;
  isTopPick?: boolean;
  featured?: boolean;
  cardAccent?: CardAccent | null;
};

const SEED_PROPERTIES: SeedProperty[] = [
  {
    title: "Modern Studio, Ba Dinh",
    description:
      "Bright studio with city views, fast Wi‑Fi, and a walkable neighborhood near Ba Dinh Square.",
    citySlug: "hanoi",
    districtSlug: "ba-dinh",
    districtName: "Ba Dinh",
    typeCode: "STUDIO",
    beds: 1,
    baths: 1,
    maxGuests: 2,
    pricePerNight: 42,
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80",
    isNew: true,
    featured: true,
    cardAccent: CardAccent.blue,
  },
  {
    title: "Bright Apartment, Tay Ho",
    description:
      "Spacious apartment steps from West Lake with balcony, kitchen, and laundry.",
    citySlug: "hanoi",
    districtSlug: "tay-ho",
    districtName: "Tay Ho",
    typeCode: "APARTMENT",
    beds: 2,
    baths: 1,
    maxGuests: 4,
    pricePerNight: 55,
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    isTopPick: true,
    featured: true,
    cardAccent: CardAccent.green,
  },
  {
    title: "Cozy House, Cau Giay",
    description:
      "Family-friendly house with garden patio, three bedrooms, and quiet residential streets.",
    citySlug: "hanoi",
    districtSlug: "cau-giay",
    districtName: "Cau Giay",
    typeCode: "HOUSE",
    beds: 3,
    baths: 2,
    maxGuests: 6,
    pricePerNight: 72,
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    featured: true,
    cardAccent: CardAccent.yellow,
  },
  {
    title: "City Studio, Hoan Kiem",
    description:
      "Compact studio in the Old Quarter — perfect for solo travelers exploring on foot.",
    citySlug: "hanoi",
    districtSlug: "hoan-kiem",
    districtName: "Hoan Kiem",
    typeCode: "STUDIO",
    beds: 0,
    baths: 1,
    maxGuests: 2,
    pricePerNight: 38,
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    featured: true,
    cardAccent: CardAccent.pink,
  },
  {
    title: "Riverside Apartment, District 1",
    description: "Modern apartment overlooking the river with gym access.",
    citySlug: "ho-chi-minh-city",
    districtSlug: "district-1",
    districtName: "District 1",
    typeCode: "APARTMENT",
    beds: 2,
    baths: 2,
    maxGuests: 4,
    pricePerNight: 48,
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    isNew: true,
  },
  {
    title: "Beach Studio, Da Nang",
    description: "Walk to the beach from this airy studio with ocean breeze.",
    citySlug: "da-nang",
    districtSlug: "my-khe",
    districtName: "My Khe",
    typeCode: "STUDIO",
    beds: 1,
    baths: 1,
    maxGuests: 2,
    pricePerNight: 35,
    rating: 4.4,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    isTopPick: true,
  },
];

async function seedLookups() {
  const typeByCode = new Map<string, string>();

  for (const type of PROPERTY_TYPES) {
    const row = await prisma.propertyType.upsert({
      where: { code: type.code },
      create: type,
      update: { name: type.name, sortOrder: type.sortOrder },
    });
    typeByCode.set(type.code, row.id);
  }

  const cityBySlug = new Map<string, string>();

  for (const city of CITIES) {
    const row = await prisma.city.upsert({
      where: { slug: city.slug },
      create: city,
      update: { name: city.name },
    });
    cityBySlug.set(city.slug, row.id);
  }

  const districtByKey = new Map<string, string>();
  const districtInputs = new Map<
    string,
    { cityId: string; name: string; slug: string }
  >();

  for (const property of SEED_PROPERTIES) {
    const cityId = cityBySlug.get(property.citySlug);
    if (!cityId) continue;

    const key = `${property.citySlug}:${property.districtSlug}`;
    if (!districtInputs.has(key)) {
      districtInputs.set(key, {
        cityId,
        name: property.districtName,
        slug: property.districtSlug,
      });
    }
  }

  for (const [key, district] of districtInputs) {
    const row = await prisma.district.upsert({
      where: {
        cityId_slug: { cityId: district.cityId, slug: district.slug },
      },
      create: district,
      update: { name: district.name },
    });
    districtByKey.set(key, row.id);
  }

  return { typeByCode, cityBySlug, districtByKey };
}

async function seedProperties(
  lookups: Awaited<ReturnType<typeof seedLookups>>,
) {
  await prisma.propertyImage.deleteMany();
  await prisma.propertyPricing.deleteMany();
  await prisma.property.deleteMany();

  for (const seed of SEED_PROPERTIES) {
    const cityId = lookups.cityBySlug.get(seed.citySlug);
    const propertyTypeId = lookups.typeByCode.get(seed.typeCode);
    const districtId = lookups.districtByKey.get(
      `${seed.citySlug}:${seed.districtSlug}`,
    );

    if (!cityId || !propertyTypeId) {
      throw new Error(`Missing lookup for seed property: ${seed.title}`);
    }

    const propertyData: Prisma.PropertyCreateInput = {
      title: seed.title,
      description: seed.description,
      beds: seed.beds,
      baths: seed.baths,
      maxGuests: seed.maxGuests,
      rating: seed.rating,
      status: ListingStatus.ACTIVE,
      isNew: seed.isNew ?? false,
      isTopPick: seed.isTopPick ?? false,
      featured: seed.featured ?? false,
      cardAccent: seed.cardAccent ?? undefined,
      city: { connect: { id: cityId } },
      propertyType: { connect: { id: propertyTypeId } },
      ...(districtId
        ? { district: { connect: { id: districtId } } }
        : {}),
      images: {
        create: {
          url: seed.imageUrl,
          alt: seed.imageAlt ?? seed.title,
          sortOrder: 0,
          isPrimary: true,
        },
      },
      pricing: {
        create: {
          pricePerNight: seed.pricePerNight,
          currency: "USD",
        },
      },
    };

    await prisma.property.create({ data: propertyData });
  }
}

async function main() {
  console.log("Seeding NestFind database…");

  const lookups = await seedLookups();
  await seedProperties(lookups);

  const [cities, types, properties] = await Promise.all([
    prisma.city.count(),
    prisma.propertyType.count(),
    prisma.property.count(),
  ]);

  console.log(
    `Done: ${cities} cities, ${types} property types, ${properties} listings.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
