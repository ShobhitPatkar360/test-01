import mongoose, { model } from "mongoose";
import "colors";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let filePath = path.join(__dirname, "../config.yaml");
// Read and load the config file
const config = yaml.load(fs.readFileSync(filePath, "utf8"));

const db = () => {
  try {
    mongoose.connect(config.MONGO_URL);
    console.log("DB CONNECTED ".bgWhite.blue);
  } catch (error) {
    console.log(error);
  }
};

export default db;
