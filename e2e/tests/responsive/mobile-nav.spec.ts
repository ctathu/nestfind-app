import { test, expect } from "../../fixtures";
import { byTestId, testIds } from "../../utils/selectors";

test.describe("Responsive: Mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile menu opens and navigates to listings", async ({
    page,
    homePage,
  }) => {
    await homePage.open();

    await expect(
      page.locator(byTestId(testIds.navbar)).getByRole("navigation", {
        name: "Main navigation",
      }),
    ).toBeHidden();

    await homePage.navbar.navigateMobile("My trips");
    await expect(page.locator(byTestId(testIds.listingsPage))).toBeVisible();
  });

  test("search bar stacks on mobile viewport", async ({ page, homePage }) => {
    await homePage.open();
    const searchBar = page.locator(byTestId(testIds.searchBar));
    await expect(searchBar).toBeVisible();
    const box = await searchBar.boundingBox();
    expect(box?.width).toBeLessThan(500);
  });
});
