import { Router } from 'express'
const router = Router()
import validate from '../middlewares/validate.js'
import { error } from '../middlewares/errorHandler.js'
import upload from '../services/multer.js'
import checkAuth from '../middlewares/check-auth-header.js'
import {
    createDocumentCtrl,
    getDocumentByIdCtrl,
    getDocumentCtrl,
} from '../controller/document.js'
import { createDocumentSchema } from '../validatorSchemas/document.js'

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

router.route('/document/:id').get(checkAuth , getDocumentByIdCtrl)

export default router;
