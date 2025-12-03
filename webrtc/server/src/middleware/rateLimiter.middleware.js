import rateLimit from 'express-rate-limit';
import { getRedisClient } from '../config/redis.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Message sending rate limiter (per user)
export const messageLimiter = async (req, res, next) => {
  if (!req.userId) {
    return next();
  }

  try {
    const redis = getRedisClient();
    const key = `message_limit:${req.userId}`;
    const limit = 30; // 30 messages per minute
    const window = 60; // 60 seconds

    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }

    if (current > limit) {
      return res.status(429).json({
        error: 'Too many messages sent, please slow down',
      });
    }

    next();
  } catch (error) {
    // If rate limiting fails, allow the request but log the error
    console.error('Rate limiter error:', error);
    next();
  }
};

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: 'Too many file uploads, please try again later',
});