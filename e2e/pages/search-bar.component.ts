import { expect, type Page } from "@playwright/test";
import { byTestId, testIds } from "../utils/selectors";

export type SearchBarOptions = {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

export class SearchBarComponent {
  readonly location;
  readonly submitButton;

  constructor(private readonly page: Page) {
    this.location = page.locator(byTestId(testIds.searchLocation));
    this.submitButton = page.locator(byTestId(testIds.searchSubmit));
  }

  /** Types into controlled React inputs so onChange state stays in sync. */
  private async fillLocation(value: string) {
    await this.location.click();
    await this.location.fill("");
    await this.location.pressSequentially(value, { delay: 40 });
    await expect(this.location).toHaveValue(value);
  }

  async fill(options: SearchBarOptions) {
    if (options.checkIn !== undefined) {
      await this.page.getByLabel("Check-in date").fill(options.checkIn);
    }
    if (options.checkOut !== undefined) {
      await this.page.getByLabel("Check-out date").fill(options.checkOut);
    }
    if (options.guests !== undefined) {
      await this.selectGuests(options.guests);
    }
    // Location last — guest/date fields can re-render and clear a filled location.
    if (options.location !== undefined) {
      await this.fillLocation(options.location);
    }
  }

  private listingsUrlMatches(location?: string) {
    const expected = location?.trim().toLowerCase();
    return (url: URL) => {
      if (!url.pathname.endsWith("/listings")) return false;
      if (!expected) return true;
      const actual = (url.searchParams.get("location") ?? "").toLowerCase();
      return actual.includes(expected) || expected.includes(actual);
    };
  }

  async selectGuests(count: number) {
    const label =
      count === 1 ? "1 guest" : `${count} guests`;
    await this.page.getByRole("combobox", { name: "Guests" }).click();
    await this.page.getByRole("option", { name: label }).click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async submitExpecting(options: SearchBarOptions) {
    await Promise.all([
      this.page.waitForURL(this.listingsUrlMatches(options.location)),
      this.submit(),
    ]);
  }
}
