import { parsePropertyId } from "@/server/dto/property-params.dto";
import { handleRouteError, successResponse } from "@/server/lib/api-response";
import { propertyService } from "@/server/services/property.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const { id } = parsePropertyId(params);
    const listing = await propertyService.getPropertyById(id);

    return successResponse({ listing });
  } catch (error) {
    return handleRouteError(error);
  }
}
