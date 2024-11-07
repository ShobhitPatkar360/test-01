import pino from "pino";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
// import pinoTransport from "./pinoTransport.js"; // Corrected import path

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

// Define your custom transport object
// Define log file path and folder
const logFolder = join(__dirname, "../logs");
// const logFilePath = join(logFolder, "logger.log");

// Ensure the logs folder exists
if (!fs.existsSync(logFolder)) {
  fs.mkdirSync(logFolder, { recursive: true });
}

const logFilePath = join(__dirname, "../logs/logger.log");
const customTransport = pino.transport({
  targets: [
    {
      level: "trace",
      target: "pino/file",
      options: {
        destination: `${logFilePath}`,
        colorize: true,
        levelFirst: false,
        translateTime: true,
        ignore: 'pid,hostname',
      },
    },
    {
      level: "trace",
      target: "./pinoTransport",
      options: {
        colorize: true,
        levelFirst: false,
        translateTime: true,
        ignore: 'pid,hostname',
      },
    },
  ]
});

export default pino(
  {
    customLevels: levels,
    useOnlyCustomLevels: true,
    level: "http",
  },
  customTransport, // Use the custom transport object here
  pino.destination(logFilePath)
);


