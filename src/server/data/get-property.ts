import { AppError } from "@/server/errors/app-error";
import { propertyService } from "@/server/services/property.service";
import type { Listing } from "@/types/listing";

export async function getPropertyForPage(id: string): Promise<Listing | null> {
  try {
    return await propertyService.getPropertyById(id);
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
