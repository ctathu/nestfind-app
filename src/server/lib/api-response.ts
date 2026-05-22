import { AppError } from "@/server/errors/app-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { Prisma } from "@prisma/client";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorBody = {
  message: string;
  code: string;
  details?: unknown;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorBody;
};

export type PaginationMeta = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export function successResponse<T>(
  data: T,
  init?: ResponseInit,
): Response {
  const body: ApiSuccessResponse<T> = { success: true, data };
  return Response.json(body, init);
}

export function errorResponse(
  status: number,
  message: string,
  code: string,
  details?: unknown,
): Response {
  const body: ApiErrorResponse = {
    success: false,
    error: { message, code, ...(details !== undefined ? { details } : {}) },
  };
  return Response.json(body, { status });
}

export function handleRouteError(error: unknown): Response {
  if (error instanceof AppError) {
    return errorResponse(
      error.statusCode,
      error.message,
      error.code,
      error.details,
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return errorResponse(500, "Database operation failed", ErrorCodes.DATABASE_ERROR);
  }

  console.error("[API]", error);
  return errorResponse(500, "Internal server error", ErrorCodes.INTERNAL_ERROR);
}

/** Unwrap success envelope for legacy clients expecting flat payloads */
export function unwrapData<T>(payload: unknown): T | null {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    (payload as ApiSuccessResponse<T>).success === true &&
    "data" in payload
  ) {
    return (payload as ApiSuccessResponse<T>).data;
  }
  return payload as T;
}
