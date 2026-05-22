import { z } from "zod";
import { AppError } from "@/server/errors/app-error";

export const propertyIdSchema = z.object({
  id: z.string().trim().min(1, "Property id is required"),
});

export type PropertyIdDto = z.infer<typeof propertyIdSchema>;

export function parsePropertyId(params: { id?: string }): PropertyIdDto {
  const parsed = propertyIdSchema.safeParse(params);

  if (!parsed.success) {
    throw AppError.validation("Invalid property id", parsed.error.flatten());
  }

  return parsed.data;
}
