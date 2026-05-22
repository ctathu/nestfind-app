import * as fs from "node:fs";
import * as path from "node:path";
import type { APIRequestContext } from "@playwright/test";
import { getListings } from "./api-helpers";

const ARTIFACTS_DIR = path.join(__dirname, "../.artifacts");
const CACHE_PATH = path.join(ARTIFACTS_DIR, "test-fixtures.json");

export type TestFixtures = {
  listingId: string;
  listingTitle: string;
  seededLocation: string;
};

export function clearFixturesCache() {
  if (fs.existsSync(CACHE_PATH)) {
    fs.unlinkSync(CACHE_PATH);
  }
}

function readCache(): TestFixtures | null {
  if (!fs.existsSync(CACHE_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8")) as TestFixtures;
  } catch {
    return null;
  }
}

function writeCache(fixtures: TestFixtures) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(fixtures, null, 2));
}

async function listingExists(
  request: APIRequestContext,
  listingId: string,
): Promise<boolean> {
  const res = await request.get(`/api/listings/${listingId}`);
  return res.ok();
}

async function fetchFreshFixtures(
  request: APIRequestContext,
): Promise<TestFixtures> {
  const data = await getListings(request, "location=Hanoi&limit=1");
  const listing = data.listings[0];
  if (!listing) {
    throw new Error(
      "No seed listings found. Run `npm run db:seed` before E2E tests.",
    );
  }

  const fixtures: TestFixtures = {
    listingId: listing.id,
    listingTitle: listing.title,
    seededLocation: "Hanoi",
  };

  writeCache(fixtures);
  return fixtures;
}

/** Resolves seed-backed listing id/title; refreshes cache when DB was re-seeded. */
export async function getTestFixtures(
  request: APIRequestContext,
): Promise<TestFixtures> {
  const cached = readCache();
  if (cached && (await listingExists(request, cached.listingId))) {
    return cached;
  }

  clearFixturesCache();
  return fetchFreshFixtures(request);
}

/** @deprecated Prefer getTestFixtures(request) so stale ids are refreshed. */
export function loadCachedFixtures(): TestFixtures {
  const cached = readCache();
  if (!cached) {
    throw new Error(
      "Test fixtures cache missing. Call getTestFixtures(request) first.",
    );
  }
  return cached;
}
