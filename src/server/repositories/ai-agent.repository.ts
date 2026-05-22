import type { AiProvider } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export type RecordAiEventInput = {
  route?: string;
  provider: AiProvider;
  latencyMs: number;
  success: boolean;
  validationPassed: boolean;
  usedFallback: boolean;
  confidence?: number;
  promptLength: number;
  listingsReturned?: number;
  errorCode?: string;
};

export class AiAgentRepository {
  async recordEvent(input: RecordAiEventInput) {
    if (process.env.AI_MONITOR_ENABLED === "false") {
      return null;
    }

    return prisma.aiAgentEvent.create({
      data: {
        route: input.route ?? "/api/ai/search",
        provider: input.provider,
        latencyMs: input.latencyMs,
        success: input.success,
        validationPassed: input.validationPassed,
        usedFallback: input.usedFallback,
        confidence: input.confidence,
        promptLength: input.promptLength,
        listingsReturned: input.listingsReturned ?? 0,
        errorCode: input.errorCode,
      },
    });
  }

  async getMetrics(windowHours = 24) {
    const since = new Date(Date.now() - windowHours * 60 * 60 * 1000);

    const [totals, byProvider, recentFailures] = await Promise.all([
      prisma.aiAgentEvent.aggregate({
        where: { createdAt: { gte: since } },
        _count: { id: true },
        _avg: { latencyMs: true, confidence: true },
      }),
      prisma.aiAgentEvent.groupBy({
        by: ["provider"],
        where: { createdAt: { gte: since } },
        _count: { id: true },
        _avg: { latencyMs: true },
      }),
      prisma.aiAgentEvent.findMany({
        where: { createdAt: { gte: since }, success: false },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          provider: true,
          latencyMs: true,
          errorCode: true,
          validationPassed: true,
          usedFallback: true,
          createdAt: true,
        },
      }),
    ]);

    const events = await prisma.aiAgentEvent.findMany({
      where: { createdAt: { gte: since } },
      select: {
        success: true,
        validationPassed: true,
        usedFallback: true,
        latencyMs: true,
      },
    });

    const total = events.length;
    const successCount = events.filter((e) => e.success).length;
    const validationPassCount = events.filter((e) => e.validationPassed).length;
    const fallbackCount = events.filter((e) => e.usedFallback).length;
    const latencies = events.map((e) => e.latencyMs).sort((a, b) => a - b);

    const percentile = (p: number) => {
      if (latencies.length === 0) return 0;
      const idx = Math.ceil((p / 100) * latencies.length) - 1;
      return latencies[Math.max(0, idx)];
    };

    return {
      windowHours,
      since: since.toISOString(),
      totalRequests: total,
      successRate: total > 0 ? successCount / total : 1,
      validationPassRate: total > 0 ? validationPassCount / total : 1,
      fallbackRate: total > 0 ? fallbackCount / total : 0,
      avgLatencyMs: Math.round(totals._avg.latencyMs ?? 0),
      p50LatencyMs: percentile(50),
      p95LatencyMs: percentile(95),
      avgConfidence: totals._avg.confidence
        ? Number(totals._avg.confidence)
        : null,
      byProvider: byProvider.map((row) => ({
        provider: row.provider,
        requests: row._count.id,
        avgLatencyMs: Math.round(row._avg.latencyMs ?? 0),
      })),
      recentFailures,
      aggregateCount: totals._count.id,
    };
  }
}

export const aiAgentRepository = new AiAgentRepository();
