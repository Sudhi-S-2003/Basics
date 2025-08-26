const winston = require("winston");
require("winston-daily-rotate-file");

const { combine, timestamp, printf, errors, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Daily rotate transport
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d", // keep 30 days of logs
});

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // log stack trace
    logFormat
  ),
  transports: [
    dailyRotateFileTransport, // logs saved to files
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // all errors
  ],
});

// In development, also log to console
if (process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    })
  );
}

module.exports = logger;
