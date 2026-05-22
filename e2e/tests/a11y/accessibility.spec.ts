import { test } from "../../fixtures";
import { expectNoCriticalA11yViolations } from "../../utils/accessibility";
import { byTestId, testIds } from "../../utils/selectors";
import { waitForListingsLoaded } from "../../utils/wait";

test.describe("Accessibility", () => {
  test("homepage passes critical axe checks", async ({ page, homePage }) => {
    await homePage.open();
    await waitForListingsLoaded(page);
    await expectNoCriticalA11yViolations(page, {
      include: byTestId(testIds.homePage),
    });
  });

  test("listings page passes critical axe checks", async ({
    page,
    listingsPage,
  }) => {
    await listingsPage.open();
    await expectNoCriticalA11yViolations(page, {
      include: byTestId(testIds.listingsPage),
    });
  });

  test("listing detail passes critical axe checks", async ({
    page,
    listingDetailPage,
    fixtures,
  }) => {
    await listingDetailPage.open(fixtures.listingId);
    await expectNoCriticalA11yViolations(page, {
      include: byTestId(testIds.listingDetail),
    });
  });
});
