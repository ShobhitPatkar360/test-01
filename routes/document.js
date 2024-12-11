import { Router } from 'express'
const router = Router()
import validate from '../middlewares/validate.js'
import { error } from '../middlewares/errorHandler.js'
import upload from '../services/multer.js'
import checkAuth from '../middlewares/check-auth-header.js'
import {
    createDocumentCtrl,
    deleteDocumentByIdCtrl,
    getDocumentByIdCtrl,
    getDocumentCtrl,
    updateDocumentByIdCtrl,
} from '../controller/document.js'
import { createDocumentSchema, updateDocumentSchema } from '../validatorSchemas/document.js'

router
    .route('/document')
    .get(checkAuth, getDocumentCtrl, error)
    .post(
        checkAuth,
        upload.single('file'),
        validate(createDocumentSchema),
        createDocumentCtrl,
        error
    )

router.route('/document/:id').get(checkAuth , getDocumentByIdCtrl, error)
router.route('/document/:id').put(checkAuth ,upload.single('file'), updateDocumentByIdCtrl, error)
router.route('/document/:id').delete(checkAuth , deleteDocumentByIdCtrl, error)

export default router;
