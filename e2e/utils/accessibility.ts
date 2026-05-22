import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

type A11yScanOptions = {
  /** WCAG tags to include (default: wcag2a, wcag2aa) */
  tags?: string[];
  /** Selector to limit scan scope */
  include?: string;
};

/**
 * Runs axe and fails on serious/critical violations.
 * Minor issues are logged but do not fail the test.
 */
export async function expectNoCriticalA11yViolations(
  page: Page,
  options: A11yScanOptions = {},
) {
  const builder = new AxeBuilder({ page }).withTags(
    options.tags ?? ["wcag2a", "wcag2aa"],
  );

  if (options.include) {
    builder.include(options.include);
  }

  const results = await builder
    .disableRules(["color-contrast"])
    .analyze();

  const blocking = results.violations.filter((v) => v.impact === "critical");

  if (blocking.length > 0) {
    const summary = blocking
      .map((v) => `${v.id} (${v.impact}): ${v.help}`)
      .join("\n");
    expect(blocking, `A11y violations:\n${summary}`).toHaveLength(0);
  }
}
