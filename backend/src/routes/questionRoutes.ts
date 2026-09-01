import { Router } from 'express';
import { questionController } from '../controllers/questionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// All question routes require authentication
router.use(requireAuth);

router.post('/', questionController.createQuestion);
router.get('/', questionController.getAllQuestions);

export default router;
