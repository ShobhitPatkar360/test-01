import yaml from 'js-yaml';
import fs from 'fs';
import routerModule from "./routes/index.js";
import logger from './services/logger.js';
import db from "./models/index.js";
// import "./utils/loadbank.js";

const loadConfig = async (app) => {
    console.log("working");
    
  try {
    // console.log('Config loaded');

    const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
    routerModule(app)
    db();
    globalThis.errorMessages = JSON.parse(
      fs.readFileSync('./error/errors.json', 'utf8'),
    );
    globalThis.config = config;
    globalThis.logger= logger;
    console.log('DB loaded');
  } catch (e) {
    console.log(e);
  }
};

export default loadConfig;
