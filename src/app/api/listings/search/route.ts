import { parseSearchQuery } from "@/server/dto/search-query.dto";
import { handleRouteError, successResponse } from "@/server/lib/api-response";
import { propertyService } from "@/server/services/property.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = parseSearchQuery(searchParams);
    const result = await propertyService.searchProperties(query);

    return successResponse(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
