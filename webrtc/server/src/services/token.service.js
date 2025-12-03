
// ============================================
// server/src/services/token.service.js
// ============================================
import jwt from 'jsonwebtoken';
import { getRefreshToken } from '../config/redis.js';

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );
};

export const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in Redis
    const storedToken = await getRefreshToken(decoded.userId, token);

    if (!storedToken) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};
