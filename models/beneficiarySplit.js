import mongoose from 'mongoose'
const { Schema } = mongoose
const { ObjectId } = Schema.Types
import { v4 as uuidv4 } from 'uuid'



const beneficiarySplitSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
        },
        entityId: {
            type: String,
        },
        inviteId: {
            type: ObjectId,
        },
        percentage: {
            type: Number,
        },
        type: {
            type: String,
        },
        createdBy: {
            type: String,
        },
    },
    { timestamps: true }
)


const beneficiarySplitModel = mongoose.model(
    'entityBeneficiarySplit',
    beneficiarySplitSchema
)

export default beneficiarySplitModel
