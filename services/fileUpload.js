// /utils/fileUpload.js
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { v1 as uuidv1 } from "uuid";
import { uploadBufferToS3 } from "../services/s3Service.js"; // Adjust the path to your S3 helper function

export const processAndUploadImage = async (imageName, uploadPath) => {
  if (!imageName) return null;

  try {
    const filePath = uploadPath
    const cvext = path.extname(imageName);
    
    // Read file and convert to base64 buffer
    const file = fs.readFileSync(filePath);
    const cvBuffer = Buffer.from(file, "base64");

    // Generate a random file name
    const randonCvBytes = uuidv1();
    const cvfilename = randonCvBytes + cvext;

    // Upload the buffer to S3
    const awsRes = await uploadBufferToS3(
      cvBuffer,
      `dev/${cvfilename}`,
      config.AWS_BUCKET_NAME
    );

    // Remove the local file after uploading
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Return the path to be stored in the updatedData
    return `dev/${cvfilename}`;
  } catch (error) {
    console.error("Error processing image upload:", error);
    throw error;
  }
};

export const copyFile = (sourcePath, destPath) => {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file does not exist: ${sourcePath}`);
  }
  fs.copyFileSync(sourcePath, destPath);
};