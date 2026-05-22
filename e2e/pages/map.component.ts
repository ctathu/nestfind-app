import { expect, type Page } from "@playwright/test";
import { DEMO_MAP_OPEN_MS } from "../utils/demo";

export class MapComponent {
  private readonly dialogTitle;

  constructor(private readonly page: Page) {
    // Radix Dialog renders an sr-only title plus the visible h2.
    this.dialogTitle = page
      .getByRole("heading", { name: "Explore listings on the map" })
      .nth(1);
  }

  async openFromCta() {
    await this.page.getByRole("button", { name: "Open map" }).click();
    await expect(this.dialogTitle).toBeVisible();
    await this.page.waitForTimeout(DEMO_MAP_OPEN_MS);
  }

  async expectListingsListed() {
    const dialog = this.page.getByRole("dialog");
    await expect(dialog.getByText(/\/night/).first()).toBeVisible();
  }

  async close() {
    await this.page.getByRole("button", { name: "Close" }).click();
    await expect(this.dialogTitle).toBeHidden();
  }
}
