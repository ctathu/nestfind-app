import { handleRouteError, successResponse } from "@/server/lib/api-response";
import { propertyService } from "@/server/services/property.service";

export async function GET() {
  try {
    const filters = await propertyService.getFilterOptions();
    return successResponse({ filters });
  } catch (error) {
    return handleRouteError(error);
  }
}
