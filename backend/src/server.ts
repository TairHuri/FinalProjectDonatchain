import mongoose from 'mongoose';
import { config } from './config';
import app from './app';
import logger from './utils/logger';

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');
    app.listen(+config.port,'0.0.0.0', () =>
      logger.info(`Server listening on port ${config.port}`)
    );
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
