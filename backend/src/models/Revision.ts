import mongoose, { Document, Schema, Types } from 'mongoose';

export type RevisionStage = 1 | 4 | 7;

export interface IRevision extends Document {
  user: Types.ObjectId;
  question: Types.ObjectId;
  revisionDate: Date;
  revisionStage: RevisionStage;
  isCompleted: boolean;
  completionTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionSchema = new Schema<IRevision>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true,
    },
    revisionDate: {
      type: Date,
      required: true,
      index: true, // Crucial for querying "Today's Revisions"
    },
    revisionStage: {
      type: Number,
      enum: [1, 4, 7],
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completionTimestamp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user's incomplete revisions by date
RevisionSchema.index({ user: 1, isCompleted: 1, revisionDate: 1 });

export const Revision = mongoose.model<IRevision>('Revision', RevisionSchema);
