import type { Page, Route } from "@playwright/test";

export async function mockListingsFailure(page: Page, status = 500) {
  await page.route("**/api/listings**", (route: Route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        error: { message: "Simulated API failure", code: "INTERNAL_ERROR" },
      }),
    }),
  );
}

export async function mockListingsDelay(page: Page, delayMs = 2000) {
  await page.route("**/api/listings**", async (route: Route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    await route.continue();
  });
}

export async function clearNetworkMocks(page: Page) {
  await page.unroute("**/api/listings**");
}
