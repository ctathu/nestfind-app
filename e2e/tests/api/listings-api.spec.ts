import { test, expect } from "@playwright/test";
import {
  getHealth,
  getListings,
  getListingById,
} from "../../utils/api-helpers";
import { getTestFixtures } from "../../utils/fixtures-cache";
import { seedListings } from "../../fixtures/test-data";

test.describe("API validation: Listings", () => {
  test.beforeAll(async ({ request }) => {
    const { getTestFixtures } = await import("../../utils/fixtures-cache");
    await getTestFixtures(request);
  });

  test("GET /api/health returns ok with connected database", async ({
    request,
  }) => {
    const health = await getHealth(request);
    expect(health.status).toBe("ok");
    expect(health.service).toBe("nestfind");
    expect(health.database).toBe("connected");
  });

  test("GET /api/listings returns paginated Hanoi listings", async ({
    request,
  }) => {
    const data = await getListings(
      request,
      "location=Hanoi&limit=10&offset=0",
    );
    expect(data.listings.length).toBeGreaterThan(0);
    expect(data.total).toBeGreaterThanOrEqual(data.listings.length);
    expect(data.limit).toBe(10);
    expect(data.offset).toBe(0);
    data.listings.forEach((listing) => {
      expect(listing.id).toBeTruthy();
      expect(listing.title).toBeTruthy();
      expect(listing.pricePerNight).toBeGreaterThan(0);
    });
  });

  test("GET /api/listings?category=STUDIO filters by type", async ({
    request,
  }) => {
    const data = await getListings(request, "category=STUDIO&location=Hanoi");
    expect(data.listings.length).toBeGreaterThan(0);
    data.listings.forEach((l) => expect(l.category).toBe("STUDIO"));
  });

  test("GET /api/listings/[id] returns single listing", async ({ request }) => {
    const { listingId } = await getTestFixtures(request);
    const { response, data } = await getListingById(request, listingId);
    expect(response.ok()).toBeTruthy();
    const parsed = data as {
      success: boolean;
      data: { listing: { id: string; title: string } };
    };
    expect(parsed.success).toBe(true);
    expect(parsed.data.listing.id).toBe(listingId);
  });

  test("GET /api/listings/[id] returns 404 for invalid id", async ({
    request,
  }) => {
    const { response, data } = await getListingById(
      request,
      seedListings.invalidListingId,
    );
    expect(response.status()).toBe(404);
    const body = data as { success: boolean; error: { code: string } };
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("NOT_FOUND");
  });

  test("GET /api/listings/search requires q parameter", async ({ request }) => {
    const res = await request.get("/api/listings/search");
    expect(res.status()).toBeGreaterThanOrEqual(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });
});
