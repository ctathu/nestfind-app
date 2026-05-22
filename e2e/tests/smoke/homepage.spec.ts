import { test, expect } from "../../fixtures";
import { byTestId, testIds } from "../../utils/selectors";
import { seedListings } from "../../fixtures/test-data";
import { waitForListingsLoaded } from "../../utils/wait";

test.describe("Smoke: Homepage", () => {
  test("renders hero, navbar, and featured listings", async ({ page, homePage }) => {
    await homePage.open();
    await waitForListingsLoaded(page);

    await expect(page.locator(byTestId(testIds.homePage))).toBeVisible();
    await expect(homePage.hero).toContainText("Find your perfect stay");
    await expect(page.locator(byTestId(testIds.navbar))).toBeVisible();
    await expect(page.locator(byTestId(testIds.searchBar))).toBeVisible();
    await expect(page.locator(byTestId(testIds.featuredListings))).toBeVisible();

    const cards = homePage.propertyCards;
    await expect(cards).toHaveCount(4);
    await expect(
      cards.filter({ hasText: seedListings.modernStudio }),
    ).toHaveCount(1);
  });

  test("property cards show title, price, and rating", async ({
    page,
    homePage,
  }) => {
    await homePage.open();
    await waitForListingsLoaded(page);

    const firstCard = homePage.propertyCards.first();
    await expect(
      firstCard.locator(byTestId(testIds.propertyCardTitle)),
    ).not.toBeEmpty();
    await expect(firstCard.getByText(/\/ night/)).toBeVisible();
    await expect(firstCard.locator("text=/\\d\\.\\d/")).toBeVisible();
  });
});
