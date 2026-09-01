import { Router } from 'express';
import { revisionController } from '../controllers/revisionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// All revision routes require authentication
router.use(requireAuth);

router.get('/today', revisionController.getTodaysRevisions);
router.patch('/:id/complete', revisionController.markRevisionComplete);

export default router;
