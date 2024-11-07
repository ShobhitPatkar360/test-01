import yaml from "js-yaml";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import AWS from "aws-sdk";

// Load configuration from YAML file
const config = yaml.load(
  fs.readFileSync(path.join(__dirname, "../config.yaml"), "utf8")
);

// Set AWS configuration
console.log("config.AWS_REGION", config.AWS_REGION);

AWS.config.update({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

export default s3;
