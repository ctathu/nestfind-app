import { handleRouteError, successResponse } from "@/server/lib/api-response";
import { statsService } from "@/server/services/stats.service";

export async function GET() {
  try {
    const stats = await statsService.getStats();
    return successResponse(stats);
  } catch (error) {
    return handleRouteError(error);
  }
}
