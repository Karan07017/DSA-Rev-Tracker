import { Router } from 'express';
import { statisticsController } from '../controllers/statisticsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', statisticsController.getStatistics);

export default router;
