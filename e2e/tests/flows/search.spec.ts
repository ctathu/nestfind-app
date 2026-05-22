import { test, expect } from "../../fixtures";
import { seedListings } from "../../fixtures/test-data";

test.describe("Critical flow: Search", () => {
  test("homepage search navigates to listings with location query", async ({
    page,
    homePage,
  }) => {
    await homePage.open();
    await homePage.searchFor(seedListings.hanoiLocation);

    await expect(page).toHaveURL(/\/listings/);
    await expect(page).toHaveURL(/location=Hanoi|city=Hanoi/i);
    await expect(page.getByRole("heading", { name: "Search stays" })).toBeVisible();
  });

  test("listings page search updates results for Hanoi", async ({
    listingsPage,
  }) => {
    await listingsPage.open();
    await listingsPage.searchFor(seedListings.hanoiLocation);

    await expect(listingsPage.listingsGrid).toBeVisible();
    await expect(listingsPage.propertyCards.first()).toBeVisible();
    const titles = await listingsPage.propertyCards
      .locator('[data-testid="property-card-title"]')
      .allTextContents();
    expect(titles.length).toBeGreaterThan(0);
  });
});
