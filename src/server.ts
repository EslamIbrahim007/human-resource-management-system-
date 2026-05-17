import app from './app.js';
import connectDB from './config/database.js';
import { env } from './config/env.js';
import logger from './shared/utils/logger.js';

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated!');
    });
  });
};

startServer();