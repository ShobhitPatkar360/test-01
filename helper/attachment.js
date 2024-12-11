import attachmentModel from '../models/attachment.js'
import { getSignedUrl } from '../services/s3Service.js'

// Helper function to create a new Attachment document
async function createAttachment(data) {
    try {
        const newAttachment = await attachmentModel.create(data)
        return newAttachment
    } catch (error) {
        throw new Error(`Error creating Attachment: ${error.message}`)
    }
}

// Helper function to get all Attachment documents
async function getAllAttachments(opt) {
    try {
        let Attachment = await attachmentModel.find(opt).lean().exec()
        for (let j = 0; j < Attachment.length; j++) {
            let ele = Attachment[j];
            if (ele.fileName) {
                const aws =await getSignedUrl(ele.fileName,config.AWS_BUCKET_NAME);
                ele['signUrl'] = aws; 
                ele['fileName']= ele.fileName.replace("dev/", "");
            }
        }
        return Attachment
    } catch (error) {
        throw new Error(`Error fetching all Attachments: ${error.message}`)
    }
}

// Helper function to get a single Attachment document by id
async function getAttachmentById(id) {
    try {
        let Attachment = await attachmentModel.findOne({ id }).exec()

        return Attachment
    } catch (error) {
        throw new Error(`Error fetching Attachment by id: ${error.message}`)
    }
}

// Helper function to update an existing Attachment document
async function updateAttachment(id, data) {
    try {
        return await attachmentModel.findOneAndUpdate({ id }, data).exec()
    } catch (error) {
        console.log(error)

        throw new Error(`Error updating Attachment: ${error.message}`)
    }
}

// Helper function to delete an Attachment document
async function deleteAttachment(id) {
    try {
        return await attachmentModel.findOneAndDelete({ id }).exec()
    } catch (error) {
        throw new Error(`Error deleting Attachment: ${error.message}`)
    }
}

async function deleteAttachmentByEntityId(entityId) {
    try {
        return await attachmentModel.deleteMany({entityId}).exec()
    } catch (error) {
        throw new Error(`Error deleting BeneficiarySplit: ${error.message}`)
    }
}

async function deleteAttachmentByOptions(option) {
    try {
        return await attachmentModel.deleteMany(option).exec()
    } catch (error) {
        throw new Error(`Error deleting BeneficiarySplit: ${error.message}`)
    }
}

// Helper function to execute multiple operations in sequence
async function executeSequence(...operations) {
    for (const operation of operations) {
        await operation()
    }
}

export {
    createAttachment,
    getAllAttachments,
    getAttachmentById,
    updateAttachment,
    deleteAttachment,
    executeSequence,
    deleteAttachmentByEntityId,
    deleteAttachmentByOptions
}
