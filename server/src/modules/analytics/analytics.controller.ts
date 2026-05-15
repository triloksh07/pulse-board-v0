import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getAnalyticsForPoll } from "./analytics.service.js";

export const show = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user ? req.user._id : null;
  res.json({
    analytics: await getAnalyticsForPoll(req.params.pollId as string, userId),
  });
});

export const showPublic = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    analytics: await getAnalyticsForPoll(req.params.pollId as string, null, {
      publicOnly: true,
    }),
  });
});
