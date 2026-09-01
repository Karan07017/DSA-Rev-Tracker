import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Question } from '../models/Question';

export const statisticsController = {
  /**
   * Get global statistics for the authenticated user
   */
  async getStatistics(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const userId = new mongoose.Types.ObjectId(user.id);

      // Perform a robust MongoDB aggregation
      const stats = await Question.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalQuestions: { $sum: 1 },
            easyCount: {
              $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] },
            },
            mediumCount: {
              $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] },
            },
            hardCount: {
              $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] },
            },
            strongCount: {
              $sum: { $cond: [{ $eq: ['$helpTaken', 'No Help'] }, 1, 0] },
            },
            weakCount: {
              $sum: { $cond: [{ $ne: ['$helpTaken', 'No Help'] }, 1, 0] },
            },
          },
        },
      ]);

      if (stats.length === 0) {
        // Return default zeroed stats if user has no questions yet
        return res.status(200).json({
          message: 'Statistics retrieved successfully',
          statistics: {
            totalQuestions: 0,
            difficulty: {
              easy: 0,
              medium: 0,
              hard: 0,
            },
            topics: {
              strong: 0,
              weak: 0,
            },
          },
        });
      }

      const result = stats[0];

      return res.status(200).json({
        message: 'Statistics retrieved successfully',
        statistics: {
          totalQuestions: result.totalQuestions,
          difficulty: {
            easy: result.easyCount,
            medium: result.mediumCount,
            hard: result.hardCount,
          },
          topics: {
            strong: result.strongCount,
            weak: result.weakCount,
          },
        },
      });
    } catch (error: any) {
      console.error('Error computing statistics:', error);
      return res.status(500).json({ error: 'Failed to compute statistics', details: error.message });
    }
  },
};
