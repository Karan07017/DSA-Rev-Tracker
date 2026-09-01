import { Request, Response } from 'express';
import { Todo } from '../models/Todo';

export const todoController = {
  /**
   * Create a new Todo item
   */
  async createTodo(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { name, link } = req.body;

      if (!name || !link) {
        return res.status(400).json({ error: 'Name and Link are required' });
      }

      const todo = await Todo.create({
        user: user.id,
        name,
        link,
      });

      return res.status(201).json({
        message: 'Todo created successfully',
        todo,
      });
    } catch (error: any) {
      console.error('Error creating todo:', error);
      return res.status(500).json({ error: 'Failed to create todo', details: error.message });
    }
  },

  /**
   * Get all Todos for the user
   */
  async getTodos(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const todos = await Todo.find({ user: user.id }).sort({ createdAt: -1 });

      return res.status(200).json({
        message: 'Todos retrieved successfully',
        todos,
      });
    } catch (error: any) {
      console.error('Error fetching todos:', error);
      return res.status(500).json({ error: 'Failed to fetch todos', details: error.message });
    }
  },

  /**
   * Delete a Todo
   */
  async deleteTodo(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { id } = req.params;

      const todo = await Todo.findOneAndDelete({ _id: id, user: user.id });

      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      return res.status(200).json({
        message: 'Todo deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      return res.status(500).json({ error: 'Failed to delete todo', details: error.message });
    }
  },
};
