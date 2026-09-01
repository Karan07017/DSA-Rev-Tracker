import { Router } from 'express';
import { calendarController } from '../controllers/calendarController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', calendarController.getCalendarData);

export default router;
