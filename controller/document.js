import {
    countDocument,
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
} from '../helper/document.js'
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
        const file = req.file
        let data = {
            ...req.body,
        }
        let user = req.user

        let featureSettings = user?.subScription?.featureSettings
        let count = await countDocument({ createdBy: user._id })
        const documentFeature = featureSettings.find(
            (feature) => feature.moduleName === 'Documents'
        )
        if (!documentFeature.setEntryLimits) {
            if (count > documentFeature.moduleEntryLimit) {
                throw new ApiError('0004', StatusCodes.BAD_REQUEST)
            }
        }
        data['createdBy'] = req.user._id
        if (file) {
            const filePath = `${uploadPath}/${file.filename}`
            if (file.filename) {
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
        console.log(error)
        next(error)
    }
}

export const getDocumentCtrl = async (req, res, next) => {
    try {
        const createdBy = req.user._id
        let user = req.user
        console.log('user', user)

        let query = { createdBy }
        let documentName = req.query.documentName
        if (documentName) {
            query['documentName'] = { $regex: documentName, $options: 'i' }
        }
        const result = await getAllDocuments(query)
        let featureSettings = user?.subScription?.featureSettings
        let count = await countDocument({ createdBy: user._id })
        const documentFeature = featureSettings.find(
            (feature) => feature.moduleName === 'Documents'
        )
        let limitExpired = false
        if (result?.length) {
            if (featureSettings) {
                if (count >= documentFeature.moduleEntryLimit) {
                    limitExpired = true
                }
            }
        }
        success(res, result, limitExpired)
    } catch (error) {
        next(error)
    }
}

export const getDocumentByIdCtrl = async (req, res, next) => {
    try {
        const result = await getDocumentById(req.params.id)
        success(res, result)
    } catch (error) {
        next(error)
    }
}

export const deleteDocumentByIdCtrl = async (req, res, next) => {
    try {
        let result = await deleteDocument(req.params.id)
        res.message = 'Document Deleted Successfully'
        success(res, result)
    } catch (error) {
        next(error)
    }
}

export const updateDocumentByIdCtrl = async (req, res, next) => {
    try {
        const { documentName, description } = req.body
        const file = req.file
        let updatedData = {}
        if (documentName) {
            updatedData['documentName'] = documentName
        }
        if (description) {
            updatedData['description'] = description
        }
        if (file) {
            const filePath = `${uploadPath}/${file.filename}`
            if (file.filename) {
                const attachment = await processAndUploadImage(
                    file.filename,
                    filePath
                )
                updatedData['document'] = {
                    fileName: attachment,
                    fileType: file.mimetype,
                    originalname: file.originalname,
                    fileSize: file.size,
                    extname: file.extname,
                }
            }
            if (fs.existsSync(filePath)) fs.unlinkSync(`${filePath}`)
        }
        let result = await updateDocument(req.params.id, updatedData)
        res.message = 'Document Updated Successfully'
        success(res, result)
    } catch (error) {
        next(error)
    }
}
