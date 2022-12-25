import express from 'express'
import controller from '../controllers/Submenu.js'

const router = express.Router()

router.post('/store', controller.store);
router.post('/update', controller.update);
router.post('/getAllowAccessSubmenu', controller.getAllowAccessSubmenu);

export default router