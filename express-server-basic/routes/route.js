const express = require("express");
const catchAsync = require("../middleware/catchAsync");
const ApiError = require("../middleware/ApiError");
const route = express.Router();

route.get("/", catchAsync(async (req, res) => {
    // Trigger error only if ?error=true
    if (req.query.error === "true") {
        throw new ApiError("Intentional error for testing", 400);
    }

    return res.success({
        message: "Base URI is accessed successfully",
        data: { info: "No error triggered"  }
    });
}));

module.exports = route;
