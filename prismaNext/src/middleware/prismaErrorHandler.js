// utils/prismaErrorHandler.js

export const prismaErrorHandler = (err) => {
  // === Prisma Known Request Error ===
  if (err.name === "PrismaClientKnownRequestError") {
    switch (err.code) {
      // Unique constraint violation
      case "P2002": {
        const fields = err.meta?.target?.join(", ");
        return {
          code: err.name,
          message: fields ? `${fields} already exists` : "Unique constraint failed",
          status: 400,
        };
      }

      // Record not found
      case "P2025":
        return {
          code: err.name,
          message: "Record not found",
          status: 404,
        };

      default:
        return {
          code: err.name,
          message: err.message || "Database request error",
          status: 400,
        };
    }
  }

  // === Prisma Validation Error ===
  if (err.name === "PrismaClientValidationError") {
    let message = err.message;

    // Missing required field
    const missingFieldMatch = message.match(/Argument `(.*?)` is missing/);
    if (missingFieldMatch) {
      message = `Missing required field: ${missingFieldMatch[1]}`;
    }

    // Type mismatch
    const typeMismatchMatch = message.match(
      /Argument `(.*?)`: Invalid value provided\. Expected (.*?), provided (.*?)\./s
    );
    if (typeMismatchMatch) {
      const field = typeMismatchMatch[1];
      const expected = typeMismatchMatch[2];
      const provided = typeMismatchMatch[3];
      message = `Field '${field}' has invalid type. Expected ${expected}, provided ${provided}`;
    }

    return {
      code: err.name,
      message,
      status: 400,
    };
  }

  // === Prisma Initialization Error ===
  if (err.name === "PrismaClientInitializationError") {
    return {
      code: err.name,
      message: "Database failed to initialize",
      status: 500,
    };
  }

  // === Prisma Rust Panic Error ===
  if (err.name === "PrismaClientRustPanicError") {
    return {
      code: err.name,
      message: "Database crashed unexpectedly",
      status: 500,
    };
  }

  // === Prisma Unknown Error ===
  if (err.name === "PrismaClientUnknownRequestError") {
    return {
      code: err.name,
      message: "Unknown database error",
      status: 500,
    };
  }

  // === Generic Prisma fallback ===
  if (err.name?.startsWith("PrismaClient")) {
    return {
      code: err.name,
      message: err.message || "Database request error",
      status: 400,
    };
  }

  // === Generic fallback for non-Prisma errors ===
  return {
    code: err.name || "INTERNAL_ERROR",
    message: err.message || "Internal Server Error",
    status: 500,
  };
};
