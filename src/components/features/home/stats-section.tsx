"use client";

import { StatCard } from "@/components/features/home/stat-card";
import { ErrorState } from "@/components/common/error-state";
import { Container } from "@/components/layout/container";
import { useStats } from "@/hooks/use-stats";

export function StatsSection() {
  const { stats, loading, error } = useStats();

  if (error && !loading) {
    return (
      <section className="py-10">
        <Container>
          <ErrorState message={error} title="Stats unavailable" />
        </Container>
      </section>
    );
  }

  const activeDisplay = loading ? "—" : (stats?.activeListingsDisplay ?? "—");
  const cities = loading ? "—" : String(stats?.citiesCovered ?? "—");
  const avgPrice = loading
    ? "—"
    : stats
      ? `$${Math.round(stats.avgPricePerNight)}`
      : "—";

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Active listings" value={activeDisplay} />
          <StatCard label="Cities covered" value={cities} />
          <StatCard label="Avg. price / night" value={avgPrice} />
        </div>
      </Container>
    </section>
  );
}
