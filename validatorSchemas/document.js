import Joi from 'joi';

// Validation for creating a new document
export const createDocumentSchema = Joi.object({
  documentName: Joi.string().required().messages({
    'string.empty': 'Document name is required.',
    'any.required': 'Document name is required.',
  }),
  description: Joi.string().optional(),
  file: Joi.any().optional(),
});