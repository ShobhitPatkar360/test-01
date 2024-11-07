import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const file_path = path.join(__dirname, "../uploads/");
const plogger = logger.child({ label: "Multer Service Calling...." });
if (!fs.existsSync(file_path)) {
  fs.mkdirSync(file_path);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    let fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
    fileName = file.originalname;
    console.log('fileName',fileName);
    
    plogger.info(fileName);
    file["extname"] = ext;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
