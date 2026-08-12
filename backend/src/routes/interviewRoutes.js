import { Router } from 'express';
import * as controller from '../controllers/interviewController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post(
  '/',
  upload.fields([
    { name: 'candidateImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  controller.create,
);
router.get('/', auth, controller.list);
router.get('/:id', auth, controller.get);

export default router;
