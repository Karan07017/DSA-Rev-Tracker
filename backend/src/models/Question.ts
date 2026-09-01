import mongoose, { Document, Schema, Types } from 'mongoose';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type HelpTakenType = 'No Help' | 'Hint' | 'Discussion' | 'AI' | 'Editorial' | 'YouTube';

export interface IQuestion extends Document {
  user: Types.ObjectId;
  name: string;
  link: string;
  difficulty: DifficultyLevel;
  approach?: string;
  topic: string;
  remarks?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  helpTaken: HelpTakenType;
  veryImportant: boolean;
  platform: string;
  solvedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    approach: {
      type: String,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    remarks: {
      type: String,
    },
    timeComplexity: {
      type: String,
    },
    spaceComplexity: {
      type: String,
    },
    helpTaken: {
      type: String,
      enum: ['No Help', 'Hint', 'Discussion', 'AI', 'Editorial', 'YouTube'],
      required: true,
    },
    veryImportant: {
      type: Boolean,
      default: false,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    solvedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
