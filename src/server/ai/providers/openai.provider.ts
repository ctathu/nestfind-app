import type { AiSearchIntentRaw } from "@/server/ai/schemas/search-intent.schema";
import { aiSearchIntentRawSchema } from "@/server/ai/schemas/search-intent.schema";

const SYSTEM_PROMPT = `You are NestFind's rental search assistant for Vietnam.
Extract structured search intent from the user message.
Respond with JSON only matching this shape:
{
  "city": optional slug: hanoi | ho-chi-minh-city | da-nang,
  "location": optional free-text location,
  "category": optional STUDIO | APARTMENT | HOUSE,
  "guests": optional number 1-50,
  "minPrice": optional USD per night,
  "maxPrice": optional USD per night,
  "topRated": optional boolean,
  "budgetFriendly": optional boolean,
  "featured": optional boolean,
  "keywords": optional search terms,
  "confidence": number 0-1,
  "summary": short friendly sentence explaining what you understood
}`;

export async function parseSearchIntentOpenAI(
  prompt: string,
  apiKey: string,
): Promise<AiSearchIntentRaw> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI request failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty content");
  }

  const parsed = JSON.parse(content) as unknown;
  const validated = aiSearchIntentRawSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error("OpenAI JSON did not match intent schema");
  }

  return validated.data;
}

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}
