import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { NavbarComponent } from "./navbar.component";
import { byTestId, testIds } from "../utils/selectors";
import { routes } from "../fixtures/test-data";

export class ListingDetailPage extends BasePage {
  readonly navbar: NavbarComponent;
  readonly detail: Locator;
  readonly notFound: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
    this.detail = page.locator(byTestId(testIds.listingDetail));
    this.notFound = page.locator(byTestId(testIds.emptyState));
    this.backLink = page.getByRole("link", { name: /back to listings/i });
  }

  async open(id: string) {
    await this.goto(routes.listingDetail(id));
    await this.waitForDetailOrThrow(id);
  }

  async waitForDetailOrThrow(id: string) {
    const detailVisible = await this.detail
      .waitFor({ state: "visible", timeout: 25_000 })
      .then(() => true)
      .catch(() => false);

    if (detailVisible) return;

    const isNotFound = await this.notFound
      .isVisible()
      .catch(() => false);

    if (isNotFound) {
      throw new Error(
        `Listing "${id}" was not found. The fixture cache may be stale — re-run \`npm run db:seed\` or delete e2e/.artifacts/.`,
      );
    }

    await expect(this.detail).toBeVisible({ timeout: 5_000 });
  }
}
