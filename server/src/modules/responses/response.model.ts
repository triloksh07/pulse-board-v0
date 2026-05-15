import mongoose, { Document } from "mongoose";

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedOptions: mongoose.Types.ObjectId[];
}

export interface IResponse extends Document {
  pollId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  anonymousName?: string;
  answers: IAnswer[];
  score: number;
  completionTime: number;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new mongoose.Schema<IAnswer>(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOptions: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema<IResponse>(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    anonymousName: {
      type: String,
      default: "Anonymous",
      trim: true,
      maxlength: 80,
    },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, default: 0 },
    completionTime: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

responseSchema.index({ pollId: 1, submittedAt: 1 });
responseSchema.index({
  pollId: 1,
  score: -1,
  completionTime: 1,
  submittedAt: 1,
});

export const Response = mongoose.model<IResponse>("Response", responseSchema);
