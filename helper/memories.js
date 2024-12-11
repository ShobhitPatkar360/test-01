import memoriesModel from '../models/memories.js'
import { getSignedUrl } from '../services/s3Service.js'
import { getAllAttachments } from './attachment.js'

// Helper function to create a new Memories Memories
async function createMemories(data) {
    try {
        const newMemories = await memoriesModel.create(data)
        return newMemories
    } catch (error) {
        throw new Error(`Error creating Memories: ${error.message}`)
    }
}

// Helper function to get all Memories Memoriess
async function getAllMemories(option,limit,order,orderBy) {
    try {
        option.isDeleted = false;
        const sort = { [orderBy]: order === 'asc' ? 1 : -1 };
        let memories = await memoriesModel.find(option).sort(sort).limit(limit).lean().exec()
        if (memories.length) {
            for (let i = 0; i < memories.length; i++) {
                const element = memories[i]
                if (element?.recipients?.length) {
                    for (let i = 0; i < element.recipients.length; i++) {
                        let recipients = element.recipients[i]
                        if (recipients?.image?.fileName) {
                            const aws = await getSignedUrl(
                                recipients.image.fileName,
                                config.AWS_BUCKET_NAME
                            )
                            recipients.image['signUrl'] = aws
                        }
                    }
                }
                let attachments = []
                let attachment = await getAllAttachments({
                    entityId: element.id,
                })
                if (attachment?.length) {
                    for (let i = 0; i < attachment.length; i++) {
                        const ele = attachment[i]
                        attachments.push(ele)
                    }
                }
                element['attachments'] = attachments
            }
        }
        return memories
    } catch (error) {
        throw new Error(`Error fetching all Memoriess: ${error.message}`)
    }
}

// Helper function to get a single Memories Memories by id
async function getMemoriesById(id) {
    try {
        let memories = await memoriesModel
            .findOne({ id, isDeleted: false })
            .lean()
            .exec()
        if (memories) {
            if (memories?.recipients?.length) {
                for (let i = 0; i < memories.recipients.length; i++) {
                    let recipients = memories.recipients[i]
                    if (recipients?.image?.fileName) {
                        const aws = await getSignedUrl(
                            recipients.image.fileName,
                            config.AWS_BUCKET_NAME
                        )
                        recipients.image['signUrl'] = aws
                    }
                }
            }
            let attachment = await getAllAttachments({
                entityId: memories.id,
            })
            let attachments = []
            if (attachment.length) {
                for (let i = 0; i < attachment.length; i++) {
                    const element = attachment[i]
                    attachments.push(element)
                }
            }
            memories['attachments'] = attachments
        }
        return memories
    } catch (error) {
        throw error
    }
}

// Helper function to update an existing Memories Memories
async function updateMemories(id, data) {
    try {
        return await memoriesModel.updateOne({ id }, data).exec()
    } catch (error) {
        throw new Error(`Error updating Memories: ${error.message}`)
    }
}

// Helper function to delete an Memories Memories
async function deleteMemories(id) {
    try {
        return await memoriesModel
            .findOneAndUpdate({ id }, { isDeleted: true })
            .exec()
    } catch (error) {
        throw new Error(`Error deleting Memories: ${error.message}`)
    }
}

// Helper function to execute multiple operations in sequence
async function executeSequence(...operations) {
    for (const operation of operations) {
        await operation()
    }
}

async function countMemories(option) {
    try {
        const count = await memoriesModel.countDocuments(option).exec();
        
        return count;
    } catch (error) {
        throw new Error(`Error counting Memories: ${error.message}`);
    }
}

export {
    createMemories,
    getAllMemories,
    getMemoriesById,
    updateMemories,
    deleteMemories,
    executeSequence,
    countMemories
}
