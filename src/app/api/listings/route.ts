import { parseListingsQuery } from "@/server/dto/listings-query.dto";
import { handleRouteError, successResponse } from "@/server/lib/api-response";
import { propertyService } from "@/server/services/property.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = parseListingsQuery(searchParams);
    const result = await propertyService.listProperties(query);

    return successResponse(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
