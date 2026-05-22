import { test, expect } from "@playwright/test";
import {
  getAiMetrics,
  postAiSearch,
} from "../../utils/api-helpers";

test.describe("API validation: AI search & monitoring", () => {
  test("POST /api/ai/search parses Hanoi studio intent and returns listings", async ({
    request,
  }) => {
    const data = await postAiSearch(
      request,
      "Studio in Hanoi for 2 guests under $45",
    );

    expect(data.provider).toBe("RULES");
    expect(data.intent.city).toBe("hanoi");
    expect(data.intent.category).toBe("STUDIO");
    expect(data.intent.guests).toBe(2);
    expect(data.validation.passed).toBe(true);
    expect(data.intent.summary.length).toBeGreaterThan(0);
    expect(data.listings.listings.length).toBeGreaterThan(0);
    data.listings.listings.forEach((l) => {
      expect(l.category).toBe("STUDIO");
    });
  });

  test("POST /api/ai/search rejects prompt shorter than 3 characters", async ({
    request,
  }) => {
    const res = await request.post("/api/ai/search", {
      data: { prompt: "hi" },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  test("POST /api/ai/search handles Ho Chi Minh top-rated apartment", async ({
    request,
  }) => {
    const data = await postAiSearch(
      request,
      "Top rated apartment in Ho Chi Minh City for 3 guests",
    );

    expect(data.intent.city).toBe("ho-chi-minh-city");
    expect(data.intent.category).toBe("APARTMENT");
    expect(data.intent.topRated).toBe(true);
    expect(data.intent.guests).toBe(3);
    expect(data.listings.total).toBeGreaterThanOrEqual(0);
  });

  test("GET /api/ai/metrics returns production monitoring aggregates", async ({
    request,
  }) => {
    await postAiSearch(request, "Budget studio in Da Nang");

    const metrics = await getAiMetrics(request);
    expect(metrics.windowHours).toBeGreaterThan(0);
    expect(metrics.totalRequests).toBeGreaterThanOrEqual(1);
    expect(typeof metrics.successRate).toBe("number");
    expect(typeof metrics.validationPassRate).toBe("number");
    expect(typeof metrics.p95LatencyMs).toBe("number");
    expect(Array.isArray(metrics.byProvider)).toBe(true);
    expect(metrics.byProvider.some((p) => p.provider === "RULES")).toBe(true);
  });
});
