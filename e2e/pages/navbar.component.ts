import type { Locator, Page } from "@playwright/test";
import { byTestId, testIds } from "../utils/selectors";

export class NavbarComponent {
  readonly root: Locator;
  readonly mobileMenuToggle: Locator;
  readonly mobileNav: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator(byTestId(testIds.navbar));
    this.mobileMenuToggle = page.locator(byTestId(testIds.mobileMenuToggle));
    this.mobileNav = page.locator(byTestId(testIds.mobileNav));
  }

  async openMobileMenu() {
    await this.mobileMenuToggle.click();
    await this.mobileNav.waitFor({ state: "visible" });
  }

  async navigateMobile(linkLabel: string) {
    await this.openMobileMenu();
    await Promise.all([
      this.page.waitForURL(/\/listings/),
      this.mobileNav.getByRole("link", { name: linkLabel }).click(),
    ]);
  }

  desktopLink(label: string) {
    return this.root
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: label });
  }
}
