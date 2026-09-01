import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/google', authController.googleLogin);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', requireAuth, authController.getCurrentUser);

export default router;
