import type { Locator, Page } from "@playwright/test";

/** Pause between demo steps (override with DEMO_PAUSE_MS). */
export const DEMO_PAUSE_MS = Number(process.env.DEMO_PAUSE_MS ?? 1_400);

/** Hold after opening the map modal before the next action (override with DEMO_MAP_OPEN_MS). */
export const DEMO_MAP_OPEN_MS = Number(process.env.DEMO_MAP_OPEN_MS ?? 1_000);

/** Scroll positions (0–1) to reveal long pages in the recorded viewport. */
const PAGE_SCROLL_STOPS = [0, 0.4, 0.75, 1] as const;

export async function pauseForDemo(page: Page, anchor?: Locator) {
  if (anchor) {
    await anchor.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(DEMO_PAUSE_MS);
}

/** Slowly scroll the page so viewers see above-the-fold and lower sections. */
export async function revealPageForDemo(page: Page) {
  for (const ratio of PAGE_SCROLL_STOPS) {
    await page.evaluate((r) => {
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      window.scrollTo({ top: max * r, behavior: "smooth" });
    }, ratio);
    await page.waitForTimeout(900);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(700);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Stable check-in / check-out for search demos (always in the future). */
export function demoStayDates() {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 14);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);
  return { checkIn: toIsoDate(checkIn), checkOut: toIsoDate(checkOut) };
}
