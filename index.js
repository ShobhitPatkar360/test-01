import express from "express";
import cors from "cors";
import init from "./init.js"; // Assuming this initializes app configurations and routes
import logger from './services/logger.js'; // Assuming this is the logger you've set up (Pino in this case)
import dotenv from 'dotenv';
import pinoHTTP from 'pino-http';
import fs from 'fs/promises'; 
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Configure dotenv
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize application configurations and routes
init(app);

// Middleware for parsing JSON and URL-encoded data
app.disable('etag');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(pinoHTTP({ logger }));


// Test endpoint
app.get('/document/ping', (req, res) => {
  res.send(`pong : ${config.APP_CONFIG.PORT}`);
});


// Start the server
app.listen(config.APP_CONFIG.PORT, config.APP_CONFIG.HOST, () => {
  logger.info(`Server started on ${config.APP_CONFIG.HOST}:${config.APP_CONFIG.PORT}`);
  console.log("Server started.");
});

// Exit handler for uncaught exceptions and rejections
const exitHandler = (err) => {
  logger.fatal("Uncaught Exception or Rejection", err); // Log fatal errors
  console.error(err);
  process.exit(1);
};

process.on("uncaughtException", exitHandler);
process.on("unhandledRejection", exitHandler);
process.on("SIGTERM", () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});
process.on("SIGINT", () => {
  logger.info('Received SIGINT (Ctrl+C), shutting down gracefully...');
  process.exit(0);
});

export default app;
