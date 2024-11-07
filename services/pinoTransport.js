import pinoPretty from "pino-pretty";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logFolder = join(__dirname, "../logs/"); // Adjusted to represent the directory
const logFilePath = join(logFolder, "logger.log");

// Check if the log folder exists, and create it if it doesn't
if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder);
}

export default (opts) =>
  pinoPretty({
    ...opts,
    messageFormat: (log, messageKey) => {
      let label = "Service";
      if (log.label) {
        label = log.label;
        delete log.label;
      } else if (log.serviceName) {
        label = log.serviceName;
        delete log.serviceName;
      }
      return `[${label}]: ${log[messageKey]}`;
    },
  });
