import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

const optionSchema = z.object({
  _id: objectId.optional(),
  text: z.string().trim().min(1).max(240),
});

const questionSchema = z
  .object({
    _id: objectId.optional(),
    questionText: z.string().trim().min(1).max(500),
    required: z.boolean().default(true),
    allowMultiple: z.boolean().default(false),
    points: z.coerce.number().min(0).max(1000).default(1),
    options: z.array(optionSchema).min(2),
    correctAnswers: z.array(objectId).default([]),
  })
  .superRefine((question, ctx) => {
    if (!question.allowMultiple && question.correctAnswers.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswers"],
        message: "Single choice questions can have at most one correct answer",
      });
    }
  });

export const createPollSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3).max(160),
      description: z.string().trim().max(1200).default(""),
      type: z.enum(["poll", "quiz"]).default("poll"),
      responseMode: z.enum(["anonymous", "authenticated"]).default("anonymous"),
      allowMultipleResponses: z.boolean().default(false),
      showLeaderboard: z.boolean().default(true),
      realtimeEnabled: z.boolean().default(true),
      expiresAt: z.coerce.date(),
      questions: z.array(questionSchema).min(1),
    })
    .refine((body) => body.expiresAt.getTime() > Date.now(), {
      path: ["expiresAt"],
      message: "Expiry date must be in the future",
    }),
});

export const updatePollSchema = createPollSchema.extend({
  params: z.object({ id: objectId }),
});

export const pollIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const shareCodeSchema = z.object({
  params: z.object({ shareCode: z.string().min(4).max(24) }),
});
