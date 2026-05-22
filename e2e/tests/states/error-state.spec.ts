import { test, expect } from "../../fixtures";
import { mockListingsFailure, clearNetworkMocks } from "../../utils/network";
import { waitForListingsLoaded } from "../../utils/wait";

test.describe("Error states", () => {
  test.afterEach(async ({ page }) => {
    await clearNetworkMocks(page);
  });

  test("listings page shows error state when API fails", async ({
    page,
    listingsPage,
  }) => {
    await mockListingsFailure(page, 500);
    await page.goto("/listings", { waitUntil: "commit" });
    await waitForListingsLoaded(page);
    await expect(listingsPage.errorState).toBeVisible();
    await expect(listingsPage.errorState).toHaveAttribute("role", "alert");
    await expect(
      page.locator('[data-testid="error-retry"]'),
    ).toBeVisible();
  });

  test("retry button refetches listings after API recovery", async ({
    page,
    listingsPage,
  }) => {
    await mockListingsFailure(page, 500);
    await page.goto("/listings", { waitUntil: "commit" });
    await expect(listingsPage.errorState).toBeVisible({ timeout: 25_000 });

    await clearNetworkMocks(page);
    await page.locator('[data-testid="error-retry"]').click();

    await expect(listingsPage.errorState).toBeHidden({ timeout: 15_000 });
    await expect(
      listingsPage.listingsGrid.or(listingsPage.emptyState),
    ).toBeVisible({ timeout: 15_000 });
  });
});
