import express from 'express'
import controller from '../controllers/Submenu.js'

const router = express.Router()

router.post('/store', controller.store);

export default router