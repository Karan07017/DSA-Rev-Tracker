import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Revision } from '../models/Revision';

export const calendarController = {
  /**
   * Get revision counts grouped by date within a specific range
   */
  async getCalendarData(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate are required parameters' });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const userId = new mongoose.Types.ObjectId(user.id);

      // Aggregate revisions grouping by the exact revisionDate
      const calendarData = await Revision.aggregate([
        {
          $match: {
            user: userId,
            revisionDate: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$revisionDate" }
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
        {
          $sort: { date: 1 },
        },
      ]);

      return res.status(200).json({
        message: 'Calendar data retrieved successfully',
        data: calendarData,
      });
    } catch (error: any) {
      console.error('Error fetching calendar data:', error);
      return res.status(500).json({ error: 'Failed to fetch calendar data', details: error.message });
    }
  },
};
