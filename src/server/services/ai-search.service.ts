import { AiProvider } from "@prisma/client";
import { parseSearchIntent } from "@/server/ai/providers";
import type { AiProviderName } from "@/server/ai/providers";
import type { AiSearchIntent } from "@/server/ai/schemas/search-intent.schema";
import { parseSearchIntentRules } from "@/server/ai/providers/rule-based.provider";
import {
  intentToListingsQuery,
  validateAiSearchIntent,
} from "@/server/ai/validation/intent-validator";
import { aiAgentRepository } from "@/server/repositories/ai-agent.repository";
import { propertyService } from "@/server/services/property.service";
import type { PaginatedListings } from "@/server/services/property.service";

export type AiSearchRequest = {
  prompt: string;
  limit?: number;
  provider?: AiProviderName;
};

export type AiSearchResponse = {
  prompt: string;
  provider: AiProviderName;
  intent: AiSearchIntent;
  validation: {
    passed: boolean;
    warnings: string[];
    usedFallback: boolean;
  };
  listings: PaginatedListings;
};

function toPrismaProvider(name: AiProviderName): AiProvider {
  return name === "OPENAI" ? AiProvider.OPENAI : AiProvider.RULES;
}

export class AiSearchService {
  async search(request: AiSearchRequest): Promise<AiSearchResponse> {
    const started = Date.now();
    const prompt = request.prompt.trim();
    const limit = request.limit ?? 12;
    let provider: AiProviderName = request.provider ?? "RULES";
    let validationPassed = false;
    let usedFallback = false;
    let warnings: string[] = [];
    let intent: AiSearchIntent;
    try {
      const parsed = await parseSearchIntent(prompt, request.provider);
      provider = parsed.provider;

      const validated = validateAiSearchIntent(parsed.intent);
      if (validated.ok) {
        intent = validated.intent;
        warnings = validated.warnings;
        validationPassed = true;
      } else {
        usedFallback = true;
        const fallback = validateAiSearchIntent(parseSearchIntentRules(prompt));
        if (!fallback.ok) {
          throw new Error("Unable to produce valid search intent");
        }
        intent = fallback.intent;
        warnings = [
          ...validated.errors,
          ...(fallback.warnings ?? []),
          "Fell back to rule-based parser after validation failure",
        ];
        provider = "RULES";
      }

      const query = intentToListingsQuery(intent, limit);
      const listings = await propertyService.listProperties(query);

      const latencyMs = Date.now() - started;
      await aiAgentRepository.recordEvent({
        provider: toPrismaProvider(provider),
        latencyMs,
        success: true,
        validationPassed,
        usedFallback,
        confidence: intent.confidence,
        promptLength: prompt.length,
        listingsReturned: listings.listings.length,
      });

      return {
        prompt,
        provider,
        intent,
        validation: { passed: validationPassed, warnings, usedFallback },
        listings,
      };
    } catch (err) {
      const errorCode = err instanceof Error ? err.name : "AI_SEARCH_ERROR";
      const latencyMs = Date.now() - started;

      await aiAgentRepository.recordEvent({
        provider: toPrismaProvider(provider),
        latencyMs,
        success: false,
        validationPassed,
        usedFallback,
        promptLength: prompt.length,
        errorCode,
      });

      throw err;
    }
  }

  async getAgentMetrics(windowHours?: number) {
    return aiAgentRepository.getMetrics(windowHours ?? 24);
  }
}

export const aiSearchService = new AiSearchService();
