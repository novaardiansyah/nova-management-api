import express from 'express'
import controller from '../controllers/Menu.js'

const router = express.Router()

router.post('/store', controller.store)
router.post('/getAllowAccessMenu', controller.getAllowAccessMenu)
router.get('/getAll', controller.getAll)
router.post('/update', controller.update)

export default router