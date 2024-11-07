import { createDocument, getAllDocuments, getDocumentById } from '../helper/document.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { ApiError } from '../error/index.js'
import { StatusCodes } from 'http-status-codes'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const uploadPath = path.join(__dirname, '../uploads/')
import { success } from '../middlewares/successHandler.js'
import { processAndUploadImage } from '../services/fileUpload.js'

export const createDocumentCtrl = async (req, res, next) => {
    try {
        console.log("working");
        
        const file = req.file
        let data = {
            ...req.body,
        }
        data['createdBy'] = req.user._id
        if (file) {
            const filePath = `${uploadPath}/${file.filename}`
            if (file.filename) {
                console.log('filePath',filePath);
                
                const attachment = await processAndUploadImage(
                        file.filename,
                        filePath
                    )
                    data['document'] = {
                        fileName: attachment,
                        fileType: file.mimetype,
                        originalname: file.originalname,
                        fileSize: file.size,
                        extname: file.extname,
                    }
            }
            if (fs.existsSync(filePath)) fs.unlinkSync(`${filePath}`)
        }
        const result = await createDocument(data)
        success(res, result)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const getDocumentCtrl = async (req, res, next) => {
    try {
        const createdBy = req.user._id
        const result = await getAllDocuments({createdBy});
        success(res, result)
    } catch (error) {
        next(error)
    }
}

export const getDocumentByIdCtrl = async (req, res, next) => {
    try {
        const result  = await getDocumentById(req.params.id);
        success(res, result)
    } catch (error) {
        next(error)
    }
}
