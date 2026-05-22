import { test, expect } from "../../fixtures";
import { byTestId, testIds } from "../../utils/selectors";

test.describe("Critical flow: Property detail", () => {
  test("navigates from listings grid to detail page", async ({
    page,
    listingsPage,
    fixtures,
  }) => {
    await listingsPage.open(
      `location=${encodeURIComponent(fixtures.seededLocation)}`,
    );
    const { id, title } = await listingsPage.openFirstListing();

    await expect(page).toHaveURL(new RegExp(`/listings/${id}$`));
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.locator(byTestId(testIds.listingDetail))).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Check availability" }),
    ).toBeVisible();
  });

  test("back link returns to listings", async ({
    page,
    listingsPage,
    listingDetailPage,
    fixtures,
  }) => {
    await listingsPage.open(
      `location=${encodeURIComponent(fixtures.seededLocation)}`,
    );
    const { id } = await listingsPage.openFirstListing();
    await listingDetailPage.waitForDetailOrThrow(id);

    await listingDetailPage.backLink.click();
    await expect(page).toHaveURL(/\/listings/);
  });
});
