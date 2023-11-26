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
  schedule.scheduleJob(getCronSchedule(), myScheduledFunction);
  logger.info("Application started! Scheduler is running...");

  if (shouldSendAlertOnStartup()) {
    sendAlert("Application is starting up...");
  }
} catch (error: any) {
  logger.error(error.message);
  process.exit(1);
}
