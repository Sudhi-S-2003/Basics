const express = require("express");
const route = require("./routes/route");
const routeNotFound = require("./middleware/routeNotFound");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const successHandler = require("./middleware/successHandler");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const limiterHandler = require("./middleware/limiterHandler");

require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(successHandler); // optional: can be called per route instead
app.use(compression());
app.use(helmet());

// Rate limiting with custom error
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP
  handler:limiterHandler
});
app.use(limiter);

// Routes
app.use("/", route);

// 404 fallback for unmatched routes
app.use(routeNotFound);

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
