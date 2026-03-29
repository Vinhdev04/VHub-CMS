import { Router } from 'express';
import {
  adminLoginController,
  getMeController,
  updateMeController,
} from '../controller/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/admin-login', adminLoginController);
router.get('/me', authMiddleware, getMeController);
router.put('/me', authMiddleware, updateMeController);

export default router;
