import { SESClient } from "@aws-sdk/client-ses";
// Set the AWS Region.
import logger from "../services/logger.js";
const childLogger = logger.child({
  label: "MAILER::SES Client",
});
childLogger.info("SES Client loaded...");
const REGION = config.AWS_REGION;
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});
export { sesClient };
