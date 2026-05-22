import { test as base } from "@playwright/test";
import { getTestFixtures, type TestFixtures } from "../utils/fixtures-cache";
import { HomePage } from "../pages/home.page";
import { ListingsPage } from "../pages/listings.page";
import { ListingDetailPage } from "../pages/listing-detail.page";

type NestFindFixtures = {
  homePage: HomePage;
  listingsPage: ListingsPage;
  listingDetailPage: ListingDetailPage;
  fixtures: TestFixtures;
};

export const test = base.extend<NestFindFixtures>({
  fixtures: async ({ request }, use) => {
    await use(await getTestFixtures(request));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  listingsPage: async ({ page }, use) => {
    await use(new ListingsPage(page));
  },
  listingDetailPage: async ({ page }, use) => {
    await use(new ListingDetailPage(page));
  },
});

export { expect } from "@playwright/test";
