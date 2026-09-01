import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  link: string;
  createdAt: Date;
}

const TodoSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
