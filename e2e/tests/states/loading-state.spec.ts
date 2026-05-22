import { test, expect } from "../../fixtures";
import { mockListingsDelay, clearNetworkMocks } from "../../utils/network";

test.describe("Loading states", () => {
  test.afterEach(async ({ page }) => {
    await clearNetworkMocks(page);
  });

  test("listings page shows loading grid while API is delayed", async ({
    page,
    listingsPage,
  }) => {
    await mockListingsDelay(page, 3000);
    const navigation = page.goto("/listings");

    await expect(listingsPage.loadingGrid).toBeVisible({ timeout: 10_000 });
    await expect(listingsPage.loadingGrid).toHaveAttribute("aria-busy", "true");

    await navigation;
    await expect(listingsPage.loadingGrid).toBeHidden({ timeout: 20_000 });
    await expect(
      listingsPage.listingsGrid.or(listingsPage.emptyState),
    ).toBeVisible();
  });
});
