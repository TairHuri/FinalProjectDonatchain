import mongoose from 'mongoose';
import { config } from './config';
import app from './app';
import logger from './utils/logger';
import { createAdmin } from './scripts/createAdmin';
import { startCampaignStatusJob } from "./jobs/campaignScheduler";
import { startCryptoRateJob } from './jobs/cryptoExchangeRateScheduler';
// import fs from 'fs'
// import https from 'https'

// const sslFiles = {
//   key: fs.readFileSync("server.key"),
//   cert: fs.readFileSync("server.cert"),
// }

const start = async () => {
  // Connect to MongoDB using the URI from config
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');
    // Ensure an admin user exists in the system
    createAdmin();

    // Start scheduled jobs
    startCampaignStatusJob(); // Periodically update campaign status
    startCryptoRateJob();     // Periodically fetch crypto exchange rates
    // Start the Express server
    // https.createServer(sslFiles, app).listen(+config.port, '0.0.0.0', () =>
    //   logger.info(`Server listening on port ${config.port}`)
    // );
    app.listen(+config.port, '0.0.0.0', () =>
      logger.info(`Server listening on port ${config.port}`)
    );
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
