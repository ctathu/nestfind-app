import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  intentToListingsQuery,
  validateAiSearchIntent,
} from "@/server/ai/validation/intent-validator";
import { parseSearchIntentRules } from "@/server/ai/providers/rule-based.provider";

describe("validateAiSearchIntent", () => {
  it("accepts valid rule-based intent for Hanoi studio", () => {
    const raw = parseSearchIntentRules("Studio in Hanoi for 2 guests under $45");
    const result = validateAiSearchIntent(raw);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.intent.city, "hanoi");
    assert.equal(result.intent.category, "STUDIO");
    assert.equal(result.intent.guests, 2);
    assert.equal(result.intent.maxPrice, 45);
    assert.ok(result.intent.confidence >= 0.35);
  });

  it("rejects invalid schema payloads", () => {
    const result = validateAiSearchIntent({ summary: "missing fields" });
    assert.equal(result.ok, false);
  });

  it("strips unknown cities with warning", () => {
    const result = validateAiSearchIntent({
      city: "paris",
      confidence: 0.8,
      summary: "Looking in Paris",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.intent.city, undefined);
    assert.ok(result.warnings.some((w) => w.includes("Unknown city")));
  });

  it("swaps inverted price bounds", () => {
    const result = validateAiSearchIntent({
      minPrice: 100,
      maxPrice: 40,
      confidence: 0.7,
      summary: "Price range",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.intent.minPrice, 40);
    assert.equal(result.intent.maxPrice, 100);
  });

  it("maps intent to listings query DTO", () => {
    const raw = parseSearchIntentRules("Top rated apartment in Ho Chi Minh City");
    const validated = validateAiSearchIntent(raw);
    assert.equal(validated.ok, true);
    if (!validated.ok) return;
    const query = intentToListingsQuery(validated.intent);
    assert.equal(query.city, "ho-chi-minh-city");
    assert.equal(query.category, "APARTMENT");
    assert.equal(query.topRated, true);
  });
});
