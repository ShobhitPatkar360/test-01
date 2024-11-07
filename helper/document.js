import documentModel from '../models/document.js'
import { getSignedUrl } from '../services/s3Service.js';

// Helper function to create a new Document document
async function createDocument(data) {
    try {
        const newDocument = await documentModel.create(data)
        return newDocument
    } catch (error) {
        throw new Error(`Error creating Document: ${error.message}`)
    }
}

// Helper function to get all Document documents
async function getAllDocuments(option) {
    try {
        let Document = await documentModel.find(option).lean().exec();
        if (Document.length) {
            for (let i = 0; i < Document.length; i++) {
                const element = Document[i].document;
                if (element?.fileName) {
                    const aws =await getSignedUrl(element.fileName,config.AWS_BUCKET_NAME);
                    element['signUrl'] = aws; 
                }
            }   
        }
        return Document
    } catch (error) {
        throw new Error(`Error fetching all Documents: ${error.message}`)
    }
}

// Helper function to get a single Document document by id
async function getDocumentById(id) {
    try {
        let Document = await documentModel.findOne({ id }).exec();
        if (Document.document) {
            if (Document.document.fileName) {
                const aws =await getSignedUrl(Document.document.fileName,config.AWS_BUCKET_NAME);
                Document.document['signUrl'] = aws; 
            }
        }
        return Document
    } catch (error) {
        throw error
    }
}

// Helper function to update an existing Document document
async function updateDocument(id, data) {
    try {
        return await documentModel.findOneAndUpdate({ id }, data).exec()
    } catch (error) {
        throw new Error(`Error updating Document: ${error.message}`)
    }
}

// Helper function to delete an Document document
async function deleteDocument(id) {
    try {
        return await documentModel.findOneAndDelete({ id }).exec()
    } catch (error) {
        throw new Error(`Error deleting Document: ${error.message}`)
    }
}

// Helper function to execute multiple operations in sequence
async function executeSequence(...operations) {
    for (const operation of operations) {
        await operation()
    }
}


export {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    executeSequence
}
