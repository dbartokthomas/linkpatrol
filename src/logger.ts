// logger.ts
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "debug", // Default log level
});

export default logger;
