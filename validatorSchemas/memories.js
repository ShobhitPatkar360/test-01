import Joi from 'joi'

// Validation for creating a new document
export const createMemoriesSchema = Joi.object({
    heading: Joi.string().required().messages({
        'string.empty': 'heading required.',
        'any.required': 'heading is required.',
    }),
    recipients: Joi.string().optional().allow(''),
    description: Joi.string().optional().allow(''),
})

export const updateDocumentSchema = Joi.object({
    heading: Joi.string().optional(),
    recipients: Joi.string().optional().allow(''),
    description: Joi.string().optional().allow(''),
})
