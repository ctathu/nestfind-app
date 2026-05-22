import { parseMetricsQuery } from "@/server/dto/ai-search.dto";
import { handleRouteError, successResponse } from "@/server/lib/api-response";
import { aiSearchService } from "@/server/services/ai-search.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const windowHours = parseMetricsQuery(searchParams);
    const metrics = await aiSearchService.getAgentMetrics(windowHours);

    return successResponse(metrics);
  } catch (error) {
    return handleRouteError(error);
  }
}
