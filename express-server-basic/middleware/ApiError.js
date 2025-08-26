class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;              // HTTP status code
        this.name = this.constructor.name;        // "ApiError"
        
        // Only capture stack trace in development
        if (process.env.NODE_ENV === "development") {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ApiError;
