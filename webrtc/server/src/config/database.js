import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDatabase = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI;

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Create indexes for better query performance
    mongoose.connection.once('open', async () => {
      logger.info('MongoDB connection established');
      
      // Indexes are defined in models, but we can ensure they're created
      await mongoose.connection.db.collection('messages').createIndex(
        { conversationId: 1, createdAt: -1 },
        { background: true }
      );
      
      await mongoose.connection.db.collection('users').createIndex(
        { email: 1 },
        { unique: true, background: true }
      );
      
      logger.info('Database indexes created');
    });

    return mongoose.connection;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  await mongoose.connection.close();
  logger.info('Database connection closed');
};