import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 240 },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true, maxlength: 500 },
    required: { type: Boolean, default: true },
    allowMultiple: { type: Boolean, default: false },
    points: { type: Number, default: 1, min: 0 },
    options: {
      type: [optionSchema],
      validate: {
        validator: (options) => options.length >= 2,
        message: "Each question must have at least 2 options",
      },
    },
    correctAnswers: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", trim: true, maxlength: 1200 },
    type: { type: String, enum: ["poll", "quiz"], default: "poll", required: true },
    shareCode: { type: String, required: true, unique: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: {
      type: String,
      enum: ["draft", "active", "expired", "published"],
      default: "active",
      index: true,
    },
    responseMode: { type: String, enum: ["anonymous", "authenticated"], default: "anonymous" },
    allowMultipleResponses: { type: Boolean, default: false },
    showLeaderboard: { type: Boolean, default: true },
    realtimeEnabled: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (questions) => questions.length >= 1,
        message: "Poll must include at least 1 question",
      },
    },
  },
  { timestamps: true }
);

pollSchema.index({ createdBy: 1, createdAt: -1 });

export const Poll = mongoose.model("Poll", pollSchema);
