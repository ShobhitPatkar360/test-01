import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { ApiError } from '../error/index.js'
import { StatusCodes } from 'http-status-codes'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const uploadPath = path.join(__dirname, '../uploads/')
import { createAttachment, deleteAttachmentByEntityId } from '../helper/attachment.js'
import {
    countMemories,
    createMemories,
    deleteMemories,
    getAllMemories,
    getMemoriesById,
    updateMemories,
} from '../helper/memories.js'
import { success } from '../middlewares/successHandler.js'
import { copyFile, processAndUploadImage } from '../services/fileUpload.js'

export const addMemoriesCtrl = async (req, res, next) => {
    try {
        let { recipients } = req.body
        let data = {
            ...req.body,
        }
        let user = req.user;
        let featureSettings = user?.subScription?.featureSettings;
        let count = await countMemories({createdBy: user._id});
        const memoryFeature = featureSettings.find(
            (feature) => feature.moduleName === "Memories"
        );
        if (!memoryFeature.setEntryLimits) {
            if (count > memoryFeature.moduleEntryLimit ) {
                throw new ApiError('0004', StatusCodes.BAD_REQUEST);
            }
        }
        data['createdBy'] = req.user._id
        if (recipients) {
            recipients = JSON.parse(recipients)
            for (let i = 0; i < recipients.length; i++) {
                let element = recipients[i]
                const fileKey = `${i}`
                let file
                if (req.files.recipientFiles) {
                    if (element.imageName) {
                        file = Object.values(req.files.recipientFiles).find(
                            (f) => f.filename === element.imageName
                        )
                    } else if (req.files.recipientFiles[fileKey]) {
                        file = req.files.recipientFiles[fileKey]
                    }
                }
                if (file) {
                    if (element.imageName === file.filename) {
                        const tempPath = `${uploadPath}/temp-${file.filename}`
                        copyFile(file.path, tempPath)
                        const awsUrl = await processAndUploadImage(
                            file.filename,
                            tempPath
                        )
                        element.image = {
                            fileName: awsUrl,
                            fileType: file.mimetype,
                            originalName: file.originalname,
                            fileSize: file.size,
                            extName: file.filename.split('.').pop(),
                        }
                        if (fs.existsSync(tempPath)) {
                            fs.unlinkSync(tempPath);
                          }
                    }
                }
            }
            data['recipients'] = recipients
        }
        const memories = await createMemories(data)

        if (memories) {
            if (req.files.attachmentFiles?.length) {
                for (let i = 0; i < req.files.attachmentFiles.length; i++) {
                    const file = req.files.attachmentFiles[i]
                    if (file.filename) {
                        const tempPath = `${uploadPath}/temp-${file.filename}`
                        copyFile(file.path, tempPath)
                        const attachment = await processAndUploadImage(
                            file.filename,
                            tempPath
                        )
                        let attachmentData = {
                            entityId: memories.id,
                            fileName: attachment,
                            fileType: file.mimetype,
                            originalname: file.originalname,
                            fileSize: file.size,
                            extname: file.extname,
                        }
                        await createAttachment(attachmentData)
                        if (fs.existsSync(tempPath)) {
                            fs.unlinkSync(tempPath);
                          }
                    }
                }
            }
        }
        success(res, memories);
    } catch (error) {
        next(error)
    }
}

export const getAllMemoriesCtrl = async (req, res, next) => {
    try {
        const createdBy = req.user._id
        let limit = req.query.limit || 1000;
        let query = { createdBy }
        let orderBy = req.query.orderBy || 'createdAt';
        let order = req.query.order || 'desc';
        const memories = await getAllMemories(query,limit,order,orderBy);
        let user = req.user;
        let featureSettings = user?.subScription?.featureSettings;
        let count = await countMemories({createdBy: user._id});
        let limitExpired = false;
        const memoryFeature = featureSettings.find(
            (feature) => feature.moduleName === "Memories"
        );
        if (memories.length) {
            if (featureSettings) {
                if (count >= memoryFeature.moduleEntryLimit ) {
                    limitExpired = true
                }
            }
        }
        
           
        success(res, memories, limitExpired);
    } catch (error) {
        next(error);
    }
}

export const getMemoriesByIdCtrl = async (req, res, next) => {
    try {
        const memories = await getMemoriesById(req.params.id);
        success(res, memories);
    } catch (error) {
        next(error);
    }
}

export const updateMemoriesCtrl = async (req, res, next) => {
    try {
        let { heading, recipients, description } = req.body;
        let updatedData = {};
        if (heading) {
            updatedData['heading'] = heading;
        }
        if (description) {
            updatedData['description'] = description;
        } else{
            updatedData['description'] = description;
        }
        if (recipients) {
            recipients = JSON.parse(recipients)
            let fileIndex = 0 // Tracks file index in req.files
            for (let i = 0; i < recipients.length; i++) {
                let element = recipients[i]
                let file
                if (req.files.recipientFiles) {
                    if (element?.imageName) {
                        file = Object.values(req.files.recipientFiles).find(
                            (f) => f.filename === element.imageName
                        )
                    }
                    if (!file && !element?.file?.signedUrl) {
                        file = req.files.recipientFiles[fileIndex]
                        fileIndex += 1
                    }
                }
                if (
                    file &&
                    !element?.file?.signedUrl &&
                    element.imageName === file.filename
                ) {
                    const tempPath = `${uploadPath}/temp-${file.filename}`
                    copyFile(file.path, tempPath)
                    const awsUrl = await processAndUploadImage(
                        file.filename,
                        tempPath
                    )
                    element.image = {
                        fileName: awsUrl,
                        fileType: file.mimetype,
                        originalName: file.originalname,
                        fileSize: file.size,
                        extName: file.filename.split('.').pop(),
                    }
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                      }
                } else if (element?.file?.signedUrl) {
                    const personImageData = propertyData?.manager?.find(
                        (ele) => ele?.file?.uri === element?.file?.uri
                    )?.image

                    if (personImageData) {
                        element.image = personImageData;
                    }
                }
            }
            updatedData['recipients'] = recipients;
        }
        if (req.files.attachmentFiles?.length) {
            await deleteAttachmentByEntityId(req.params.id)
            for (let i = 0; i < req.files.attachmentFiles.length; i++) {
                const file = req.files.attachmentFiles[i]
                if (file.filename) {
                    const tempPath = `${uploadPath}/temp-${file.filename}`
                    copyFile(file.path, tempPath)
                    const attachment = await processAndUploadImage(
                        file.filename,
                        tempPath
                    )
                    let attachmentData = {
                        entityId: req.params.id,
                        fileName: attachment,
                        fileType: file.mimetype,
                        originalname: file.originalname,
                        fileSize: file.size,
                        extname: file.extname,
                    }
                    await createAttachment(attachmentData)
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                      }
                }
            }
        }

        let result = await updateMemories(req.params.id, updatedData);
        res.message ='Document Updated Successfully'
        success(res, result)

    } catch (error) {
        next(error);
    }
}

export const deleteMemoriesByIdCtrl = async (req, res, next) => {
    try {
        let result = await deleteMemories(req.params.id);
        res.message ='Document Deleted Successfully'
        success(res, result)
    } catch (error) {
        next(error)
    }
}
