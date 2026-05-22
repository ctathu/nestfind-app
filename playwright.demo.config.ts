import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

/** Full HD — matches typical screen recordings and reduces cropped UI. */
const DEMO_VIEWPORT = { width: 1920, height: 1080 };
const DEMO_SLOW_MO = Number(process.env.DEMO_SLOW_MO ?? 900);

/** Playwright config for the product demo walkthrough (records browser video). */
export default defineConfig({
  testDir: "./e2e/tests/demo",
  testMatch: /walkthrough\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 480_000,
  expect: { timeout: 25_000 },
  outputDir: "test-results/demo",
  reporter: [["list"]],
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL,
    headless: true,
    trace: "off",
    screenshot: "off",
    video: {
      mode: "on",
      size: DEMO_VIEWPORT,
    },
    launchOptions: {
      slowMo: DEMO_SLOW_MO,
    },
    actionTimeout: 20_000,
    navigationTimeout: 35_000,
  },
  projects: [
    {
      name: "demo",
      use: {
        ...devices["Desktop Chrome"],
        viewport: DEMO_VIEWPORT,
        deviceScaleFactor: 1,
        launchOptions: {
          slowMo: DEMO_SLOW_MO,
        },
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
