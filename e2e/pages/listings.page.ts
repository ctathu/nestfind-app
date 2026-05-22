import { expect, type Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { NavbarComponent } from "./navbar.component";
import {
  SearchBarComponent,
  type SearchBarOptions,
} from "./search-bar.component";
import { byTestId, testIds } from "../utils/selectors";
import { routes } from "../fixtures/test-data";
import { waitForListingsLoaded } from "../utils/wait";

export class ListingsPage extends BasePage {
  readonly navbar: NavbarComponent;
  readonly searchBar: SearchBarComponent;
  readonly root: Locator;
  readonly searchLocation: Locator;
  readonly searchSubmit: Locator;
  readonly listingsGrid: Locator;
  readonly propertyCards: Locator;
  readonly emptyState: Locator;
  readonly errorState: Locator;
  readonly loadingGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
    this.searchBar = new SearchBarComponent(page);
    this.root = page.locator(byTestId(testIds.listingsPage));
    this.searchLocation = page.locator(byTestId(testIds.searchLocation));
    this.searchSubmit = page.locator(byTestId(testIds.searchSubmit));
    this.listingsGrid = page.locator(byTestId(testIds.listingsGrid));
    this.propertyCards = page.locator(byTestId(testIds.propertyCard));
    this.emptyState = page.locator(byTestId(testIds.emptyState));
    this.errorState = page.locator(byTestId(testIds.errorState));
    this.loadingGrid = this.root.locator(byTestId(testIds.loadingGrid));
  }

  async open(query = "") {
    const path = query ? `${routes.listings}?${query}` : routes.listings;
    await this.goto(path);
    await waitForListingsLoaded(this.page);
  }

  async searchFor(location: string) {
    await this.searchBar.fill({ location });
    await this.searchBar.submit();
    await waitForListingsLoaded(this.page);
  }

  async searchWith(options: SearchBarOptions) {
    await this.searchBar.fill(options);
    await this.searchBar.submitExpecting(options);
    await waitForListingsLoaded(this.page);
  }

  async filterByCategory(categoryId: string) {
    await this.page.locator(byTestId(testIds.categoryChip(categoryId))).click();
    await waitForListingsLoaded(this.page);
  }

  async openListingByTitle(title: string): Promise<{ id: string; title: string }> {
    const card = this.propertyCards.filter({ hasText: title });
    await expect(card).toHaveCount(1);
    const link = card.locator(byTestId(testIds.propertyCardLink));
    const href = await link.getAttribute("href");
    if (!href?.match(/\/listings\/[^/]+$/)) {
      throw new Error(`Expected property card link for "${title}", got: ${href ?? "null"}`);
    }
    const id = href.split("/").pop()!;
    await link.click();
    return { id, title };
  }

  async openFirstListing(): Promise<{ id: string; title: string }> {
    const card = this.propertyCards.first();
    const link = card.locator(byTestId(testIds.propertyCardLink));
    const href = await link.getAttribute("href");
    const title =
      (await card.locator(byTestId(testIds.propertyCardTitle)).textContent()) ??
      "";

    if (!href?.match(/\/listings\/[^/]+$/)) {
      throw new Error(`Expected property card link, got: ${href ?? "null"}`);
    }

    const id = href.split("/").pop()!;
    await link.click();
    return { id, title: title.trim() };
  }
}
