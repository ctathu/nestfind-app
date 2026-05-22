import { test, expect } from "../../fixtures";
import { seedListings } from "../../fixtures/test-data";

test.describe("Empty states", () => {
  test("listings page shows no matches for unknown location", async ({
    listingsPage,
  }) => {
    await listingsPage.open();
    await listingsPage.searchFor(seedListings.noMatchLocation);

    await expect(listingsPage.emptyState).toBeVisible();
    await expect(listingsPage.emptyState).toContainText("No matches");
    await expect(listingsPage.listingsGrid).toHaveCount(0);
  });

  test("invalid listing id shows not found page", async ({ page }) => {
    await page.goto(`/listings/${seedListings.invalidListingId}`);
    await expect(page.locator('[data-testid="empty-state"]')).toContainText(
      "Listing not found",
    );
    await expect(
      page.getByRole("link", { name: "Browse all listings" }),
    ).toBeVisible();
  });
});
