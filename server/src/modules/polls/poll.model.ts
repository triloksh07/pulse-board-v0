import mongoose, { Document } from "mongoose";

export interface IOption {
  _id?: mongoose.Types.ObjectId;
  text: string;
}

export interface IQuestion {
  _id?: mongoose.Types.ObjectId;
  questionText: string;
  options: IOption[];
  required: boolean;
  allowMultiple: boolean;
  points?: number;
  correctAnswers?: mongoose.Types.ObjectId[];
}

export interface IPoll extends Document {
  title: string;
  description: string;
  type: "poll" | "quiz";
  shareCode: string;
  createdBy: mongoose.Types.ObjectId;
  status: "draft" | "active" | "expired" | "published";
  responseMode: "anonymous" | "authenticated";
  allowMultipleResponses?: boolean;
  expiresAt?: Date;
  published: boolean;
  showLeaderboard: boolean;
  realtimeEnabled: boolean;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const optionSchema = new mongoose.Schema<IOption>(
  {
    text: { type: String, required: true, trim: true, maxlength: 240 },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    questionText: { type: String, required: true, trim: true, maxlength: 500 },
    required: { type: Boolean, default: true },
    allowMultiple: { type: Boolean, default: false },
    points: { type: Number, default: 1, min: 0 },
    options: {
      type: [optionSchema],
      validate: {
        validator: (options: IOption[]) => options.length >= 2,
        message: "Each question must have at least 2 options",
      },
    },
    correctAnswers: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema<IPoll>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", trim: true, maxlength: 1200 },
    type: {
      type: String,
      enum: ["poll", "quiz"],
      default: "poll",
      required: true,
    },
    shareCode: { type: String, required: true, unique: true, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "expired", "published"],
      default: "active",
      index: true,
    },
    responseMode: {
      type: String,
      enum: ["anonymous", "authenticated"],
      default: "anonymous",
    },
    allowMultipleResponses: { type: Boolean, default: false },
    showLeaderboard: { type: Boolean, default: true },
    realtimeEnabled: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (questions: IQuestion[]) => questions.length >= 1,
        message: "Poll must include at least 1 question",
      },
    },
  },
  { timestamps: true }
);

pollSchema.index({ createdBy: 1, createdAt: -1 });

export const Poll = mongoose.model<IPoll>("Poll", pollSchema);
