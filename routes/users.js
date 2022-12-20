import express from 'express'
import controller from '../controllers/User.js'

const router = express.Router()

router.get('/', controller.get);

export default router