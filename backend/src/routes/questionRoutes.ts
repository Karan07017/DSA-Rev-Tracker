import { Router } from 'express';
import { questionController } from '../controllers/questionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// All question routes require authentication
router.use(requireAuth);

router.post('/', questionController.createQuestion);
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

export default router;
