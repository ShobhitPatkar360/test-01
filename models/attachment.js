import mongoose from 'mongoose'
const { Schema } = mongoose
const { ObjectId } = Schema.Types
import { v4 as uuidv4 } from 'uuid'



const attachmentSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
        },
        entityId: {
            type: String,
        },
        fileName:{
            type: String
        },
        fileType:{
            type: String
        },
        fileSize:{
            type: String
        },
        originalname:{
            type: String
        },
        extname:{
            type: String
        }
    },
    { timestamps: true }
)


const attachmentModel = mongoose.model(
    'attachments',
    attachmentSchema
)

export default attachmentModel
