const ApiError = require("./ApiError");

const limiterHandler= (req, res, next) => {
    // Use your custom ApiError
    throw new ApiError("Too many requests from this IP, please try again later.", 429);
  }
  module.exports=limiterHandler