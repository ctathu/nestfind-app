import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { MapComponent } from "./map.component";
import { NavbarComponent } from "./navbar.component";
import {
  SearchBarComponent,
  type SearchBarOptions,
} from "./search-bar.component";
import { byTestId, testIds } from "../utils/selectors";
import { routes } from "../fixtures/test-data";
import { waitForListingsLoaded } from "../utils/wait";

export class HomePage extends BasePage {
  readonly navbar: NavbarComponent;
  readonly searchBar: SearchBarComponent;
  readonly map: MapComponent;
  readonly hero: Locator;
  readonly searchLocation: Locator;
  readonly searchSubmit: Locator;
  readonly featuredSection: Locator;
  readonly featuredGrid: Locator;
  readonly propertyCards: Locator;
  readonly aiAssistant: Locator;
  readonly aiSearchInput: Locator;
  readonly aiSearchSubmit: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
    this.searchBar = new SearchBarComponent(page);
    this.map = new MapComponent(page);
    this.hero = page.locator(byTestId(testIds.heroSection));
    this.searchLocation = page.locator(byTestId(testIds.searchLocation));
    this.searchSubmit = page.locator(byTestId(testIds.searchSubmit));
    this.featuredSection = page.locator(byTestId(testIds.featuredListings));
    this.featuredGrid = page.locator(byTestId(testIds.featuredListingsGrid));
    this.propertyCards = page.locator(byTestId(testIds.propertyCard));
    this.aiAssistant = page.locator(byTestId(testIds.aiSearchAssistant));
    this.aiSearchInput = page.locator(byTestId(testIds.aiSearchInput));
    this.aiSearchSubmit = page.locator(byTestId(testIds.aiSearchSubmit));
  }

  async open() {
    await this.goto(routes.home);
  }

  async waitForStats() {
    await this.page.waitForResponse(
      (res) =>
        res.url().includes("/api/stats") &&
        res.request().method() === "GET" &&
        res.ok(),
    );
    await expect(this.page.getByText("Active listings")).toBeVisible();
    await expect(this.page.getByText("Cities covered")).toBeVisible();
    await expect(this.page.getByText("Avg. price / night")).toBeVisible();
  }

  async searchFor(location: string) {
    await this.searchBar.fill({ location });
    await this.searchBar.submitExpecting({ location });
  }

  async searchWith(options: SearchBarOptions) {
    await expect(this.page.locator(byTestId(testIds.homePage))).toBeVisible();
    await this.searchBar.fill(options);
    await this.searchBar.submitExpecting(options);
  }

  async selectCategory(categoryId: string) {
    await this.page.locator(byTestId(testIds.categoryChip(categoryId))).click();
    await waitForListingsLoaded(this.page);
  }

  async clickSeeAllFeatured() {
    await Promise.all([
      this.page.waitForURL(/\/listings/),
      this.page.getByRole("link", { name: /See all/ }).click(),
    ]);
  }

  async openFeaturedListing(title: string) {
    const card = this.propertyCards.filter({ hasText: title });
    const link = card.locator(byTestId(testIds.propertyCardLink));
    const href = await link.getAttribute("href");
    if (!href?.match(/\/listings\/[^/]+$/)) {
      throw new Error(`Expected property card link for "${title}", got: ${href ?? "null"}`);
    }
    await link.click();
    return { id: href.split("/").pop()!, title };
  }

  async toggleSaveOnFirstCard() {
    const heart = this.propertyCards
      .first()
      .getByRole("button", { name: /Save listing|Remove from saved/i });
    await heart.click();
  }

  /** Natural-language search via AI concierge (navigates to /listings). */
  async searchWithAi(prompt: string) {
    await expect(this.aiAssistant).toBeVisible();
    await this.aiSearchInput.scrollIntoViewIfNeeded();

    const aiResponse = this.page.waitForResponse(
      (res) =>
        res.url().includes("/api/ai/search") &&
        res.request().method() === "POST" &&
        res.ok(),
    );

    await this.aiSearchInput.fill(prompt);
    await this.aiSearchSubmit.click();
    await aiResponse;
    await this.page.waitForURL(/\/listings/, { timeout: 30_000 });
    await waitForListingsLoaded(this.page);
  }
}
