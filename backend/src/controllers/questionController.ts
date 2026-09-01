import { Request, Response } from 'express';
import { Question } from '../models/Question';
import { Revision } from '../models/Revision';

export const questionController = {
  /**
   * Create a new Question and automatically schedule 1-4-7 revisions
   */
  async createQuestion(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const {
        name,
        link,
        difficulty,
        approach,
        topic,
        remarks,
        timeComplexity,
        spaceComplexity,
        helpTaken,
        veryImportant,
        platform,
        solvedDate,
      } = req.body;

      // Basic validation
      if (!name || !link || !difficulty || !topic || !helpTaken || !platform) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate Difficulty
      if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
        return res.status(400).json({ error: 'Invalid difficulty level' });
      }

      // Validate Help Taken
      const validHelpOptions = ['No Help', 'Hint', 'Discussion', 'AI', 'Editorial', 'YouTube'];
      if (!validHelpOptions.includes(helpTaken)) {
        return res.status(400).json({ error: 'Invalid help taken option' });
      }

      const baseSolvedDate = solvedDate ? new Date(solvedDate) : new Date();

      // Create Question
      const question = await Question.create({
        user: user.id,
        name,
        link,
        difficulty,
        approach,
        topic,
        remarks,
        timeComplexity,
        spaceComplexity,
        helpTaken,
        veryImportant: Boolean(veryImportant),
        platform,
        solvedDate: baseSolvedDate,
      });

      // Schedule Revisions (1-4-7 strategy)
      const schedules = [1, 4, 7];
      const revisionDocs = schedules.map((days) => {
        const targetDate = new Date(baseSolvedDate);
        targetDate.setDate(targetDate.getDate() + days);
        // Normalize time to midnight UTC for uniform querying
        targetDate.setUTCHours(0, 0, 0, 0);

        return {
          user: user.id,
          question: question._id,
          revisionDate: targetDate,
          revisionStage: days, // 1, 4, or 7
          isCompleted: false,
        };
      });

      await Revision.insertMany(revisionDocs);

      return res.status(201).json({
        message: 'Question created and revisions scheduled successfully',
        question,
      });
    } catch (error: any) {
      console.error('Error creating question:', error);
      return res.status(500).json({ error: 'Failed to create question', details: error.message });
    }
  },

  /**
   * Get all questions for the authenticated user with pagination and sorting
   */
  async getAllQuestions(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Filter parameters
      const search = req.query.search as string;
      const difficulty = req.query.difficulty as string;
      const topic = req.query.topic as string;

      // Ensure valid pagination values
      if (page < 1 || limit < 1) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
      }

      // Build dynamic query
      const query: any = { user: user.id };

      if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive regex search on name
      }
      if (difficulty) {
        query.difficulty = difficulty;
      }
      if (topic) {
        query.topic = { $regex: topic, $options: 'i' }; // Case-insensitive topic matching
      }

      const [questions, total] = await Promise.all([
        Question.find(query)
          .sort({ createdAt: -1 }) // Newest first
          .skip(skip)
          .limit(limit),
        Question.countDocuments(query),
      ]);

      return res.status(200).json({
        message: 'Questions retrieved successfully',
        questions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      return res.status(500).json({ error: 'Failed to fetch questions', details: error.message });
    }
  },
};
