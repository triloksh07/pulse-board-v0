import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const submitResponseSchema = z.object({
  params: z.object({ pollId: objectId }),
  body: z.object({
    anonymousName: z.string().trim().max(80).optional(),
    completionTime: z.coerce.number().min(0).max(86400).default(0),
    answers: z
      .array(
        z.object({
          questionId: objectId,
          selectedOptions: z.array(objectId).default([]),
        })
      )
      .default([]),
  }),
});

export const pollIdSchema = z.object({
  params: z.object({ pollId: objectId }),
});
