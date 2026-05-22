import type { Page } from "@playwright/test";
import { byTestId, testIds } from "./selectors";

const outcomeSelector = [
  byTestId(testIds.listingsGrid),
  byTestId(testIds.featuredListingsGrid),
  byTestId(testIds.emptyState),
  byTestId(testIds.errorState),
].join(", ");

export async function waitForListingsLoaded(page: Page) {
  const loading = page.locator(byTestId(testIds.loadingGrid));
  const outcome = page.locator(outcomeSelector).first();

  if (await loading.isVisible().catch(() => false)) {
    await loading.waitFor({ state: "hidden", timeout: 25_000 });
  }

  await outcome.waitFor({ state: "visible", timeout: 25_000 });
}
