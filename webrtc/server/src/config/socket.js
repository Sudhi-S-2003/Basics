import { createAdapter } from '@socket.io/redis-adapter';
import jwt from 'jsonwebtoken';
import { getRedisPubSubClients, setUserOnline, setUserOffline } from './redis.js';
import { registerSocketHandlers } from '../sockets/handlers.js';
import { registerWebRTCHandlers } from '../sockets/webrtc.handlers.js';
import logger from '../utils/logger.js';

export const configureSocketIO = async (io) => {
  // Configure Redis adapter for horizontal scaling
  const { redisPubClient, redisSubClient } = getRedisPubSubClients();
  io.adapter(createAdapter(redisPubClient, redisSubClient));

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.userId;
      socket.user = decoded;

      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', async (socket) => {
    const userId = socket.userId;
    logger.info(`User connected: ${userId} (socket: ${socket.id})`);

    // Set user online status
    await setUserOnline(userId, socket.id);

    // Join user's personal room for private messages
    socket.join(`user:${userId}`);

    // Emit online status to friends/contacts
    socket.broadcast.emit('user:online', { userId, timestamp: Date.now() });

    // Register all event handlers
    registerSocketHandlers(io, socket);
    registerWebRTCHandlers(io, socket);

    // Handle disconnection
    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${userId} (socket: ${socket.id})`);
      
      await setUserOffline(userId);
      
      // Notify others
      socket.broadcast.emit('user:offline', { 
        userId, 
        timestamp: Date.now() 
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  // Global error handler
  io.engine.on('connection_error', (err) => {
    logger.error('Socket.IO connection error:', {
      code: err.code,
      message: err.message,
      context: err.context,
    });
  });

  logger.info('Socket.IO configured successfully');
};