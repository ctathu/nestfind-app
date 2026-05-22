/** Stable seed titles from prisma/seed.ts */
export const seedListings = {
  modernStudio: "Modern Studio, Ba Dinh",
  brightApartment: "Bright Apartment, Tay Ho",
  hanoiLocation: "Hanoi",
  hoChiMinhLocation: "Ho Chi Minh City",
  noMatchLocation: "ZZZNOMATCH999",
  invalidListingId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
} as const;

export const routes = {
  home: "/",
  listings: "/listings",
  listingDetail: (id: string) => `/listings/${id}`,
} as const;
