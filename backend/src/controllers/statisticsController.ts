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

      const stats = await Question.aggregate([
        { $match: { user: userId } },
        {
          $facet: {
            global: [
              {
                $group: {
                  _id: null,
                  totalQuestions: { $sum: 1 },
                  easyCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] } },
                  mediumCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] } },
                  hardCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] } },
                }
              }
            ],
            byTopic: [
              {
                $group: {
                  _id: '$topic',
                  total: { $sum: 1 },
                  strongCount: { $sum: { $cond: [{ $eq: ['$helpTaken', 'No Help'] }, 1, 0] } }
                }
              },
              {
                $project: {
                  topic: '$_id',
                  total: 1,
                  strongCount: 1,
                  masteryPercentage: {
                    $multiply: [{ $divide: ['$strongCount', '$total'] }, 100]
                  },
                  _id: 0
                }
              },
              { $sort: { masteryPercentage: -1, total: -1 } } // Sort by mastery desc, then volume
            ]
          }
        }
      ]);

      const globalStats = stats[0].global[0] || {
        totalQuestions: 0,
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0
      };

      const topicStats = stats[0].byTopic || [];

      // Determine Strong and Weak Topics
      // Strong: Mastery >= 70%
      // Weak: Mastery < 70% or lowest mastery
      // We'll return the full list sorted, and let the frontend decide, or we can split them here.
      const strongTopics = topicStats.filter((t: any) => t.masteryPercentage >= 60).slice(0, 5);
      const weakTopics = [...topicStats].sort((a: any, b: any) => a.masteryPercentage - b.masteryPercentage).filter((t: any) => t.masteryPercentage < 60).slice(0, 5);

      return res.status(200).json({
        message: 'Statistics retrieved successfully',
        statistics: {
          totalQuestions: globalStats.totalQuestions,
          difficulty: {
            easy: globalStats.easyCount,
            medium: globalStats.mediumCount,
            hard: globalStats.hardCount,
          },
          topicMastery: topicStats, // Send full list for graphs
          topStrong: strongTopics,
          topWeak: weakTopics
        },
      });
    } catch (error: any) {
      console.error('Error computing statistics:', error);
      return res.status(500).json({ error: 'Failed to compute statistics', details: error.message });
    }
  },
};
