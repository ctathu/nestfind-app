import { test, expect } from "@playwright/test";
import { byTestId, testIds } from "../../utils/selectors";
import { waitForListingsLoaded } from "../../utils/wait";

test.describe("Flow: AI search assistant", () => {
  test("submits natural language query and navigates to filtered listings", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(byTestId(testIds.aiSearchAssistant))).toBeVisible();

    await page.locator(byTestId(testIds.aiSearchInput)).fill(
      "Studio in Hanoi for 2 guests under $45",
    );
    await page.locator(byTestId(testIds.aiSearchSubmit)).click();

    await page.waitForURL(/\/listings/, { timeout: 30_000 });
    await waitForListingsLoaded(page);

    await expect(page.locator(byTestId(testIds.listingsPage))).toBeVisible();
    await expect(page.locator(byTestId(testIds.listingsGrid))).toBeVisible();

    const cards = page.locator(byTestId(testIds.propertyCard));
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("example chip fills prompt input", async ({ page }) => {
    await page.goto("/");
    const input = page.locator(byTestId(testIds.aiSearchInput));
    await page.getByTestId("ai-search-example").first().click();
    await expect(input).not.toHaveValue("");
  });
});
