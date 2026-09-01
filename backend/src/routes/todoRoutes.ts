import { Router } from 'express';
import { todoController } from '../controllers/todoController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Protect all routes with auth middleware
router.use(requireAuth);

router.post('/', todoController.createTodo);
router.get('/', todoController.getTodos);
router.delete('/:id', todoController.deleteTodo);

export default router;
