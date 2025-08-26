const logger = require("../util/logger");
const ApiError = require("./ApiError");

const globalErrorHandler = (err, req, res, next) => {
    // Log error using Winston
    logger.error(err);

    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle custom ApiError instances
    if (err instanceof ApiError) {
        // statusCode and message already set in err
    }
    // Mongoose CastError – invalid ObjectId
    else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid value for '${err.path}': '${err.value}'`;
    }
    // Mongoose ValidationError – schema validation failure
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors).map(el => el.message);
        message = `Validation failed: ${errors.join("; ")}`;
    }
    // Mongoose Duplicate Key Error
    else if (err.code === 11000) {
        statusCode = 400;
        const fields = Object.keys(err.keyValue);
        message = `Duplicate field value(s): ${fields.map(f => `'${f}'`).join(", ")}`;
    }
    // JWT Errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your token has expired. Please log in again.";
    }
    // Multer file upload errors
    else if (err.code === "LIMIT_FILE_SIZE") {
        statusCode = 400;
        message = "File too large. Please upload a smaller file.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        statusCode = 400;
        message = "Unexpected file uploaded.";
    }
    // Zod validation errors
    else if (err.name === "ZodError") {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(", ");
    }
    // Joi validation errors
    else if (err.isJoi) {
        statusCode = 400;
        message = err.details.map(d => d.message).join("; ");
    }

    // Send response
    if (process.env.NODE_ENV === "development") {
        // Include stack trace and full error in development
        res.status(statusCode).json({
            success: false,
            message,
            stack: err.stack,
            error: err
        });
    } else {
        // Only send operational error message in production
        res.status(statusCode).json({
            success: false,
            message
        });
    }
};

module.exports = globalErrorHandler;
