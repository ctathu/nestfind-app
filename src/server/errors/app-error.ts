import { ErrorCodes, type ErrorCode } from "@/server/errors/error-codes";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor(
    message: string,
    options: {
      statusCode?: number;
      code?: ErrorCode;
      details?: unknown;
    } = {},
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? ErrorCodes.INTERNAL_ERROR;
    this.details = options.details;
  }

  static notFound(message = "Resource not found") {
    return new AppError(message, {
      statusCode: 404,
      code: ErrorCodes.NOT_FOUND,
    });
  }

  static validation(message: string, details?: unknown) {
    return new AppError(message, {
      statusCode: 400,
      code: ErrorCodes.VALIDATION_ERROR,
      details,
    });
  }

  static internal(message = "Internal server error") {
    return new AppError(message, {
      statusCode: 500,
      code: ErrorCodes.INTERNAL_ERROR,
    });
  }
}
