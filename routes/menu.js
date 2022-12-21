import express from 'express'
import controller from '../controllers/Menu.js'

const router = express.Router()

router.post('/store', controller.store);

export default router