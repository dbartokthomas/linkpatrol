// config.ts
import fs from "fs";
import path from "path";
import logger from "./logger";
import { Config } from "./types/config";

/**
 * Validates that either all or none of the TELEGRAM_* and PUSHOVER_* environment variables are set.
 */
export const validateEnvVars = (): void => {
  const validateGroup = (vars: string[], groupName: string) => {
    const isAllSet = vars.every((envVar) => !!process.env[envVar]);
    const isPartiallySet = vars.some((envVar) => !!process.env[envVar]);

    if (isPartiallySet && !isAllSet) {
      throw new Error(
        `Either all or none of the ${groupName} variables must be set.`
      );
    }
  };

  validateGroup(["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"], "TELEGRAM_*");
  validateGroup(["PUSHOVER_APP_TOKEN", "PUSHOVER_USER_KEY"], "PUSHOVER_*");
};

/**
 * Validates the presence of the config/config.json file.
 */
export const validateConfigFile = (): void => {
  const configPath = path.join(__dirname, "config", "config.json");

  if (!fs.existsSync(configPath)) {
    throw new Error("config.json file is missing in /config directory.");
  }

  // Optional: Further validation of the config file's contents
};

/**
 * Reads and parses the config.json file.
 */
export const readConfigFile = (): Config => {
  const configPath = path.join(__dirname, "config", "config.json");
  const configFile = fs.readFileSync(configPath, "utf8");
  return JSON.parse(configFile);
};

export const writeConfigFile = (configData: any): void => {
  const configPath = path.join(__dirname, "config", "config.json");

  try {
    const data = JSON.stringify(configData, null, 2); // Pretty print the JSON
    fs.writeFileSync(configPath, data, "utf8");
    logger.info("Configuration file updated successfully.");
  } catch (error: any) {
    throw new Error(`Failed to write to config file: ${error.message}`);
  }
};

// Export getters for environment variables
export const getTelegramBotToken = (): string =>
  process.env.TELEGRAM_BOT_TOKEN || "";
export const getTelegramChatId = (): string =>
  process.env.TELEGRAM_CHAT_ID || "";
export const getPushoverAppToken = (): string =>
  process.env.PUSHOVER_APP_TOKEN || "";
export const getPushoverUserKey = (): string =>
  process.env.PUSHOVER_USER_KEY || "";
export const shouldSendAlertOnStartup = (): boolean => {
  const value = process.env.SEND_ALERT_ON_STARTUP;
  return value !== undefined ? value.toLowerCase() === "true" : true;
};
export const getCronSchedule = (): string => {
  return process.env.CRON_SCHEDULE || "*/30 * * * *"; // Default to every 30 minutes if not set
};

// Add more getters as needed for other environment variables
