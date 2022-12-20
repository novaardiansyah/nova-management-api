import express from 'express'
import controller from '../controllers/User.js'

const router = express.Router()

router.get('/', controller.get);
router.get('/:id', controller.getId);

router.post('/', controller.post);
router.patch('/:id', controller.patch);

router.delete('/:id', controller.deleted);

export default router