import { z } from "zod";
import { AppError } from "@/server/errors/app-error";

export const aiSearchBodySchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(3, "Describe what you're looking for (at least 3 characters)")
    .max(500, "Prompt is too long"),
  limit: z.coerce.number().int().positive().max(24).optional(),
  provider: z.enum(["RULES", "OPENAI"]).optional(),
});

export type AiSearchBodyDto = z.infer<typeof aiSearchBodySchema>;

export async function parseAiSearchBody(request: Request): Promise<AiSearchBodyDto> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw AppError.validation("Request body must be valid JSON");
  }

  const parsed = aiSearchBodySchema.safeParse(body);
  if (!parsed.success) {
    throw AppError.validation("Invalid AI search request", parsed.error.flatten());
  }

  return parsed.data;
}

export function parseMetricsQuery(searchParams: URLSearchParams) {
  const hours = searchParams.get("windowHours");
  const parsed = z.coerce.number().int().positive().max(168).safeParse(hours ?? "24");
  return parsed.success ? parsed.data : 24;
}
