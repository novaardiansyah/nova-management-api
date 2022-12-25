import express from 'express'
import controller from '../controllers/RoleAccess.js'

const router = express.Router()

router.post('/store', controller.store);
router.post('/get', controller.get);
router.post('/update', controller.update);

export default router