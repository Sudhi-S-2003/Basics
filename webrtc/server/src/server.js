import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database.js';
import { initRedis } from './config/redis.js';
import { configureSocketIO } from './config/socket.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import logger from './utils/logger.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Metrics endpoint (basic)
app.get('/metrics', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.status(200).json({
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// Serve uploaded files (if local storage)
if (process.env.UPLOAD_TYPE === 'local') {
  app.use('/uploads', express.static('uploads'));
}

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    logger.info('MongoDB connected successfully');

    // Connect to Redis
    await initRedis();
    logger.info('Redis connected successfully');

    // Configure Socket.IO with Redis adapter and handlers
    await configureSocketIO(io);
    logger.info('Socket.IO configured with Redis adapter');

    // Start server
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

export { app, io };
