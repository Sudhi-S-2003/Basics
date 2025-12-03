// ==========================================
// server/src/config/redis.js
// ==========================================
import { createClient } from 'redis';
import logger from '../utils/logger.js';

let redisClient;
let redisPubClient;
let redisSubClient;

export const initRedis = async () => {
  const redisConfig = {
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
  };

  if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
  }

  // Main Redis client for general operations
  redisClient = createClient(redisConfig);

  // Pub/Sub clients for Socket.IO adapter
  redisPubClient = createClient(redisConfig);
  redisSubClient = createClient(redisConfig);

  redisClient.on('error', (err) => logger.error('Redis Client Error:', err));
  redisPubClient.on('error', (err) => logger.error('Redis Pub Error:', err));
  redisSubClient.on('error', (err) => logger.error('Redis Sub Error:', err));

  redisClient.on('connect', () => logger.info('Redis client connected'));
  redisPubClient.on('connect', () => logger.info('Redis pub client connected'));
  redisSubClient.on('connect', () => logger.info('Redis sub client connected'));

  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();

  return { redisClient, redisPubClient, redisSubClient };
};

export const getRedisClient = () => {
  if (!redisClient) throw new Error('Redis client not initialized');
  return redisClient;
};

export const getRedisPubSubClients = () => {
  if (!redisPubClient || !redisSubClient)
    throw new Error('Redis pub/sub clients not initialized');
  return { redisPubClient, redisSubClient };
};

// ===============================
// Token management functions
// ===============================
export const saveRefreshToken = async (userId, token, deviceInfo = {}) => {
  const key = `refresh_token:${userId}:${token}`;
  const data = { token, userId, deviceInfo, createdAt: Date.now() };
  await redisClient.setEx(key, 7 * 24 * 60 * 60, JSON.stringify(data)); // 7 days
};

export const getRefreshToken = async (userId, token) => {
  const key = `refresh_token:${userId}:${token}`;
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const deleteRefreshToken = async (userId, token) => {
  const key = `refresh_token:${userId}:${token}`;
  await redisClient.del(key);
};

export const deleteAllUserTokens = async (userId) => {
  const pattern = `refresh_token:${userId}:*`;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) await redisClient.del(keys);
};

// ===============================
// User presence management
// ===============================
export const setUserOnline = async (userId, socketId) => {
  await redisClient.hSet(
    `user:${userId}:presence`,
    'status', 'online',
    'socketId', socketId,
    'lastSeen', Date.now().toString()
  );

  // Optional: expire after 1 hour for cleanup
  await redisClient.expire(`user:${userId}:presence`, 3600);
};

export const setUserOffline = async (userId) => {
  await redisClient.hSet(
    `user:${userId}:presence`,
    'status', 'offline',
    'lastSeen', Date.now().toString()
  );
};

export const getUserPresence = async (userId) => {
  const presence = await redisClient.hGetAll(`user:${userId}:presence`);
  return Object.keys(presence).length
    ? presence
    : { status: 'offline', lastSeen: null, socketId: null };
};

// ===============================
// Close Redis connections
// ===============================
export const closeRedis = async () => {
  if (redisClient) await redisClient.quit();
  if (redisPubClient) await redisPubClient.quit();
  if (redisSubClient) await redisSubClient.quit();
  logger.info('Redis connections closed');
};
