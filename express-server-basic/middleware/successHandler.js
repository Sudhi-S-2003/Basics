const logger = require("../util/logger");

const successHandler = (req, res, next) => {

    res.success = ({ message = "Successfully done action", data = null, status = 200 }) => {
        logger.info(`${req.method} ${req.originalUrl} - ${message}`);

        return res.status(status).json({
            success: true,
            message,
            data,
        });
    };

    // pagination should be passed as an argument!
    res.pagination = ({ message = "Successfully done action", data = [], pagination = {}, status = 200 }) => {
        logger.info(`${req.method} ${req.originalUrl} - ${message}`);

        return res.status(status).json({
            success: true,
            message,
            data,
            pagination,
        });
    };

    next(); // pass control to the next middleware/route handler
};

module.exports = successHandler;
