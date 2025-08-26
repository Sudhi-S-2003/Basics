import { NextResponse } from "next/server";
import { prismaErrorHandler } from "./prismaErrorHandler";

const ERROR_MAP = {
  VALIDATION_ERROR: { status: 400, message: "Validation failed" },
  UNAUTHORIZED_ERROR: { status: 401, message: "Unauthorized" },
  FORBIDDEN_ERROR: { status: 403, message: "Forbidden" },
  NOT_FOUND_ERROR: { status: 404, message: "Resource not found" },
  CONFLICT_ERROR: { status: 409, message: "Conflict error" },
  PrismaClientKnownRequestError: { status: 400, message: "Database request error" },
  PrismaClientUnknownRequestError: { status: 500, message: "Unknown database error" },
  PrismaClientRustPanicError: { status: 500, message: "Database crashed unexpectedly" },
  PrismaClientInitializationError: { status: 500, message: "Database failed to initialize" },
  PrismaClientValidationError: { status: 400, message: "Database validation error" },
  INTERNAL_ERROR: { status: 500, message: "Internal Server Error" },
};

const errorWrapper = (handler) => {
  return async (req) => {
    try {
      return await handler(req);
    } catch (err) {
      console.error("API Error:", err);

      let errorCode = err.name || "INTERNAL_ERROR";
      let errorInfo = ERROR_MAP[errorCode] || ERROR_MAP.INTERNAL_ERROR;
      let message = err.message;

      // Use Prisma error handler if it's a Prisma error
      if (err.name?.startsWith("PrismaClient")) {
        const prismaError = prismaErrorHandler(err);
        errorCode = prismaError.code;
        message = prismaError.message;
        errorInfo.status = prismaError.status;
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: errorCode,
            message,
            details: err.details || null,
          },
        },
        { status: errorInfo.status }
      );
    }
  };
};

export default errorWrapper;
