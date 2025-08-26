const logger = require("../util/logger");

const globalErrorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle Mongoose ValidationError
    if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors).map(el => el.message);
        message = `Validation failed: ${errors.join(", ")}`;
    }

    // Handle Mongoose duplicate key error
    if (err.code && err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for field '${field}': '${err.keyValue[field]}'`;
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = globalErrorHandler;
