import mongoose from 'mongoose';
const { Schema } = mongoose;
import { v4 as uuidv4 } from 'uuid';



const memoriesSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
        },
        heading:{
            type: String
        },
        description:{
            type: String
        },
        recipients:{
            type: Array
        },
        createdBy: {
            type: String,
        },
        isDeleted:{
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);


const memoriesModel = mongoose.model(
    'memories',
    memoriesSchema
)

export default memoriesModel;
