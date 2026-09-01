import { Request, Response } from 'express';
import { Revision } from '../models/Revision';

export const revisionController = {
  /**
   * Get all incomplete revisions scheduled for today or earlier
   */
  async getTodaysRevisions(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Establish "Today" boundary in UTC midnight to match how dates were scheduled
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Add 24 hours to represent the upper boundary (exclusive)
      // Actually, since we want everything scheduled for today or BEFORE today (overdue),
      // we can just check if revisionDate is less than or equal to today's UTC midnight.
      const revisions = await Revision.find({
        user: user.id,
        isCompleted: false,
        revisionDate: { $lte: today },
      })
      .populate('question')
      .sort({ revisionDate: 1 }); // Oldest (most overdue) first

      return res.status(200).json({
        message: 'Retrieved revisions successfully',
        revisions,
      });
    } catch (error: any) {
      console.error('Error fetching revisions:', error);
      return res.status(500).json({ error: 'Failed to fetch revisions', details: error.message });
    }
  },

  /**
   * Mark a specific revision as complete
   */
  async markRevisionComplete(req: Request, res: Response) {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Find the revision and ensure it belongs to the authenticated user
      const revision = await Revision.findOne({ _id: id, user: user.id });

      if (!revision) {
        return res.status(404).json({ error: 'Revision not found or unauthorized' });
      }

      if (revision.isCompleted) {
        return res.status(400).json({ error: 'Revision is already completed' });
      }

      // Mark as complete and record the timestamp
      revision.isCompleted = true;
      revision.completionTimestamp = new Date();
      await revision.save();

      return res.status(200).json({
        message: 'Revision marked as complete',
        revision,
      });
    } catch (error: any) {
      console.error('Error updating revision:', error);
      return res.status(500).json({ error: 'Failed to update revision', details: error.message });
    }
  },
};
