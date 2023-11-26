import logger from "./logger";
import "dotenv/config";
import schedule from "node-schedule";
import {
  validateEnvVars,
  validateConfigFile,
  readConfigFile,
  writeConfigFile,
  shouldSendAlertOnStartup,
  getCronSchedule,
} from "./config";
import { processUrls } from "./processUrls";
import { sendAlert } from "./alerts";

// index.ts

let scheduledJob: any = null;
logger.info("Application is starting...");

try {
  validateEnvVars();
  validateConfigFile();

  const myScheduledFunction = async (): Promise<void> => {
    const config = readConfigFile();

    logger.info("Running Checks");
    const shouldSave: boolean = await processUrls(config.settings);

    // Once processed - let's write the config back out
    if (shouldSave) {
      logger.info("Saving config file");
      writeConfigFile(config);
    } else {
      logger.info("No changes to config file");
    }
  };

  // Schedule the function to run every hour
  logger.info(`Schedule ${getCronSchedule()}`);

  scheduledJob = schedule.scheduleJob(getCronSchedule(), myScheduledFunction);

  // myScheduledFunction();
  logger.info("Application started! Scheduler is running...");

  if (shouldSendAlertOnStartup()) {
    sendAlert("Application is starting up...");
  }
} catch (error: any) {
  logger.error(error.message);
  process.exit(1);
}

// Graceful shutdown function
function gracefulShutdown() {
  logger.info("Shutting down gracefully.");

  // Cancel the scheduled job
  if (scheduledJob) scheduledJob.cancel();

  // Exit the process
  process.exit(0);
}

// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
