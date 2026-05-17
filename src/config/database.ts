import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../shared/utils/logger.js';

const connectDB = async (): Promise<void> => {
  try {

    let dbUri = env.mongodbUri;
    /* if (dbUri.includes('localhost') || dbUri.includes('mongo') || dbUri.includes('host.docker.internal')) {
      dbUri = 'mongodb://127.0.0.1:27017/hrms_dev';
    } */
    logger.info(`📡 Attempting to connect to MongoDB at: ${dbUri}`);

    const conn = await mongoose.connect(dbUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;