import { Router } from 'express'
const router = Router()
import validate from '../middlewares/validate.js'
import { error } from '../middlewares/errorHandler.js'
import upload from '../services/multer.js'
import checkAuth from '../middlewares/check-auth-header.js'
import { createMemoriesSchema } from '../validatorSchemas/memories.js'
import { addMemoriesCtrl, deleteMemoriesByIdCtrl, getAllMemoriesCtrl, getMemoriesByIdCtrl, updateMemoriesCtrl } from '../controller/memories.js'


router
    .route('/memories')
    .get(checkAuth, getAllMemoriesCtrl, error)
    .post(
        checkAuth,
        upload.fields([{name: 'recipientFiles'},{name:'attachmentFiles'}]),
        validate(createMemoriesSchema),
        addMemoriesCtrl,
        error
    )

router.route('/memories/:id').get(checkAuth ,getMemoriesByIdCtrl ,error)
router.route('/memories/:id').put(checkAuth ,upload.fields([{name: 'recipientFiles'},{name:'attachmentFiles'}]), updateMemoriesCtrl, error)
router.route('/memories/:id').delete(checkAuth , deleteMemoriesByIdCtrl ,error)

export default router;
