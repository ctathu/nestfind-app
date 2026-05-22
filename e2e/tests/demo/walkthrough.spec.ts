import { test, expect } from "../../fixtures";
import { byTestId, testIds } from "../../utils/selectors";
import { seedListings } from "../../fixtures/test-data";
import { demoStayDates, pauseForDemo, revealPageForDemo } from "../../utils/demo";
import { waitForListingsLoaded } from "../../utils/wait";

test.describe("Demo walkthrough (video)", () => {
  test("end-to-end product tour", async ({
    page,
    homePage,
    listingsPage,
    listingDetailPage,
  }) => {
    const dates = demoStayDates();

    await test.step("Home — hero, stats, and featured listings", async () => {
      const statsLoaded = page.waitForResponse(
        (res) =>
          res.url().includes("/api/stats") &&
          res.request().method() === "GET" &&
          res.ok(),
      );
      await homePage.open();
      await statsLoaded;
      await waitForListingsLoaded(page);

      await expect(page.locator(byTestId(testIds.homePage))).toBeVisible();
      await expect(homePage.hero).toContainText("Find your perfect stay");
      await expect(page.getByText("Active listings")).toBeVisible();
      await expect(homePage.featuredSection).toBeVisible();
      await expect(homePage.featuredGrid).toBeVisible();
      await expect(homePage.propertyCards).toHaveCount(4);
      await revealPageForDemo(page);
      await pauseForDemo(page, homePage.hero);
    });

    await test.step("Home — AI search assistant (natural language)", async () => {
      await pauseForDemo(page, homePage.aiAssistant);
      await homePage.searchWithAi("Studio in Hanoi for 2 guests under $45");

      await expect(page.locator(byTestId(testIds.listingsPage))).toBeVisible();
      await expect(listingsPage.listingsGrid).toBeVisible();
      await expect(listingsPage.propertyCards.first()).toBeVisible();
      await revealPageForDemo(page);
      await pauseForDemo(page, listingsPage.root);

      await page.getByRole("link", { name: "NestFind home" }).click();
      await waitForListingsLoaded(page);
      await expect(page.locator(byTestId(testIds.homePage))).toBeVisible();
      await pauseForDemo(page, homePage.aiAssistant);
    });

    await test.step("Home — category chips filter featured results", async () => {
      await pauseForDemo(page, page.locator(byTestId(testIds.categoryChips)));
      await homePage.selectCategory("apartment");
      await expect(
        page.locator(byTestId(testIds.categoryChip("apartment"))),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(homePage.propertyCards.first()).toBeVisible();
      await homePage.selectCategory("all");
      await pauseForDemo(page, homePage.featuredGrid);
    });

    await test.step("Home — save listing (heart) on featured card", async () => {
      await pauseForDemo(page, homePage.propertyCards.first());
      await homePage.toggleSaveOnFirstCard();
      await expect(
        homePage.propertyCards
          .first()
          .getByRole("button", { name: "Remove from saved" }),
      ).toBeVisible();
      await homePage.toggleSaveOnFirstCard();
      await pauseForDemo(page);
    });

    await test.step("Home — map modal with listing pins", async () => {
      await pauseForDemo(page, page.getByRole("button", { name: "Open map" }));
      await homePage.map.openFromCta();
      await homePage.map.expectListingsListed();
      await pauseForDemo(page, page.getByRole("dialog"));
      await homePage.map.close();
      await pauseForDemo(page);
    });

    await test.step("Home — See all featured → listings", async () => {
      await homePage.clickSeeAllFeatured();
      await expect(page.locator(byTestId(testIds.listingsPage))).toBeVisible();
      await expect(listingsPage.listingsGrid).toBeVisible();
      await revealPageForDemo(page);
      await pauseForDemo(page, listingsPage.root);
    });

    await test.step("Navbar — Saved stays", async () => {
      await homePage.navbar.desktopLink("Saved").click();
      await expect(page).toHaveURL(/saved=true/);
      await expect(listingsPage.root).toBeVisible();
      await pauseForDemo(page);
    });

    await test.step("Navbar — My trips (listings)", async () => {
      await homePage.navbar.desktopLink("My trips").click();
      await expect(page).toHaveURL(/\/listings/);
      await expect(listingsPage.listingsGrid).toBeVisible();
      await pauseForDemo(page);
    });

    await test.step("Search — location, dates, and guests", async () => {
      await listingsPage.searchWith({
        location: seedListings.hoChiMinhLocation,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        guests: 4,
      });

      await expect(page).toHaveURL(/location=Ho/i);
      await expect(page).toHaveURL(/checkIn=/);
      await expect(page).toHaveURL(/checkOut=/);
      await expect(page).toHaveURL(/guests=4/);
      await expect(listingsPage.propertyCards.first()).toBeVisible();
      await pauseForDemo(page);
    });

    await test.step("Filters — top rated, house, budget-friendly (Hanoi)", async () => {
      await listingsPage.searchWith({
        location: seedListings.hanoiLocation,
        checkIn: "",
        checkOut: "",
        guests: 2,
      });
      await expect(listingsPage.listingsGrid).toBeVisible();

      await listingsPage.filterByCategory("top-rated");
      await expect(page).toHaveURL(/topRated=true/i);
      await expect(listingsPage.propertyCards.first()).toBeVisible();
      await pauseForDemo(page);

      await listingsPage.filterByCategory("house");
      await expect(page).toHaveURL(/category=HOUSE/i);
      await expect(listingsPage.propertyCards.first()).toBeVisible();
      await pauseForDemo(page);

      await listingsPage.filterByCategory("budget-friendly");
      await expect(page).toHaveURL(/budgetFriendly=true/i);
      await expect(listingsPage.propertyCards.first()).toBeVisible();
      await pauseForDemo(page);
    });

    await test.step("Empty state — no matches, then recover", async () => {
      await listingsPage.searchFor(seedListings.noMatchLocation);
      await expect(listingsPage.emptyState).toBeVisible();
      await expect(listingsPage.emptyState).toContainText("No matches");
      await pauseForDemo(page);

      await listingsPage.searchFor(seedListings.hanoiLocation);
      await expect(listingsPage.listingsGrid).toBeVisible();
      await pauseForDemo(page);
    });

    await test.step("Listings — studio filter and open seeded listing", async () => {
      await listingsPage.filterByCategory("studio");
      await expect(page).toHaveURL(/category=STUDIO/i);

      const { id, title } = await listingsPage.openListingByTitle(
        seedListings.modernStudio,
      );
      await listingDetailPage.waitForDetailOrThrow(id);

      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(page.locator(byTestId(testIds.listingDetail))).toBeVisible();
      await expect(page.getByText("New")).toBeVisible();
      await expect(page.getByRole("button", { name: "Check availability" })).toBeVisible();
      await pauseForDemo(page);

      await listingDetailPage.backLink.click();
      await expect(page).toHaveURL(/\/listings/);
      await pauseForDemo(page);
    });

    await test.step("Home — open featured card from homepage", async () => {
      await page.getByRole("link", { name: "NestFind home" }).click();
      await waitForListingsLoaded(page);
      await expect(page.locator(byTestId(testIds.homePage))).toBeVisible();

      const { id, title } = await homePage.openFeaturedListing(
        seedListings.brightApartment,
      );
      await listingDetailPage.waitForDetailOrThrow(id);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(page.getByText("Top pick")).toBeVisible();
      await pauseForDemo(page);

      await listingDetailPage.backLink.click();
      await pauseForDemo(page);
    });

    await test.step("Home — full search from hero (Hanoi + dates)", async () => {
      await page.getByRole("link", { name: "NestFind home" }).click();
      await expect(page.locator(byTestId(testIds.homePage))).toBeVisible();
      await waitForListingsLoaded(page);

      await homePage.searchWith({
        location: seedListings.hanoiLocation,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        guests: 2,
      });
      await expect(listingsPage.listingsGrid).toBeVisible();

      await page.getByRole("link", { name: "NestFind home" }).click();
      await waitForListingsLoaded(page);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await expect(page.getByRole("link", { name: "Terms" })).toBeVisible();
      await pauseForDemo(page);
    });
  });
});
