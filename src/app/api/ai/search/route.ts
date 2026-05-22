import { parseAiSearchBody } from "@/server/dto/ai-search.dto";
import { handleRouteError, successResponse } from "@/server/lib/api-response";
import { aiSearchService } from "@/server/services/ai-search.service";

export async function POST(request: Request) {
  try {
    const body = await parseAiSearchBody(request);
    const result = await aiSearchService.search({
      prompt: body.prompt,
      limit: body.limit,
      provider: body.provider,
    });

    return successResponse(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
