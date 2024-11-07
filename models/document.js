import mongoose from 'mongoose';
const { Schema } = mongoose;
import { v4 as uuidv4 } from 'uuid';



const documentSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4,
        },
        documentName: {
            type: String,
        },
        description: {
            type: String
        },
        createdBy: {
            type: String,
        },
        document:{
            type: Object
        }
    },
    { timestamps: true }
);


const documentModel = mongoose.model(
    'document',
    documentSchema
)

export default documentModel;
