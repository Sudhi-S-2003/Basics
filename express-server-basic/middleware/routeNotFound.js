const logger = require("../util/logger");

// 404 fallback for unmatched routes
const routeNotFound = (req, res) => {
    // Log the unmatched route
    logger.warn(`Route not found: ${req.originalUrl}`);

    res.status(404).json({
        success: false,
        message: "Route not found"
    });
};

module.exports = routeNotFound;
