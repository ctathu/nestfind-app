import { test, expect } from "../../fixtures";

test.describe("Critical flow: Filters", () => {
  test("studio category filter updates URL and grid", async ({
    page,
    listingsPage,
  }) => {
    await listingsPage.open();
    await listingsPage.filterByCategory("studio");

    await expect(page).toHaveURL(/category=STUDIO/i);
    await expect(listingsPage.listingsGrid).toBeVisible();
    await expect(listingsPage.propertyCards).not.toHaveCount(0);
  });

  test("budget-friendly filter shows affordable listings", async ({
    page,
    listingsPage,
  }) => {
    await listingsPage.open();
    await listingsPage.filterByCategory("budget-friendly");

    await expect(page).toHaveURL(/budgetFriendly=true/i);
    await expect(listingsPage.propertyCards.first()).toBeVisible();
  });
});
