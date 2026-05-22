import type { AiSearchIntentRaw } from "@/server/ai/schemas/search-intent.schema";
import {
  isOpenAiConfigured,
  parseSearchIntentOpenAI,
} from "@/server/ai/providers/openai.provider";
import { parseSearchIntentRules } from "@/server/ai/providers/rule-based.provider";

export type AiProviderName = "RULES" | "OPENAI";

export type ProviderParseResult = {
  intent: AiSearchIntentRaw;
  provider: AiProviderName;
};

export async function parseSearchIntent(
  prompt: string,
  preferredProvider?: AiProviderName,
): Promise<ProviderParseResult> {
  const useOpenAi =
    preferredProvider === "OPENAI" ||
    (preferredProvider !== "RULES" && isOpenAiConfigured());

  if (useOpenAi && isOpenAiConfigured()) {
    const intent = await parseSearchIntentOpenAI(
      prompt,
      process.env.OPENAI_API_KEY!.trim(),
    );
    return { intent, provider: "OPENAI" };
  }

  return {
    intent: parseSearchIntentRules(prompt),
    provider: "RULES",
  };
}
