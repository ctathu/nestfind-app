import { propertyRepository } from "@/server/repositories/property.repository";
import type { StatsResult } from "@/types/listing";

const BASELINE = {
  activeListings: Number(process.env.STATS_BASELINE_LISTINGS ?? 12400),
  activeListingsDisplay: "12,400+",
  citiesCovered: Number(process.env.STATS_BASELINE_CITIES ?? 48),
};

export class StatsService {
  async getStats(): Promise<StatsResult> {
    const stats = await propertyRepository.aggregateStats();

    const activeListings = Math.max(BASELINE.activeListings, stats.count);
    const citiesCovered = Math.max(BASELINE.citiesCovered, stats.citiesCovered);

    const useBaselineDisplay = stats.count < BASELINE.activeListings;

    return {
      activeListings,
      activeListingsDisplay: useBaselineDisplay
        ? BASELINE.activeListingsDisplay
        : activeListings.toLocaleString("en-US"),
      citiesCovered,
      avgPricePerNight: stats.avgPricePerNight || 38,
      currency: "USD",
    };
  }
}

export const statsService = new StatsService();
