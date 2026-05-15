import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getOwnedPoll } from "../polls/poll.service.js";
import { getLeaderboardForPoll } from "./leaderboard.service.js";

export const show = asyncHandler(async (req: Request, res: Response) => {
  await getOwnedPoll(req.params.pollId as string, req.user._id);
  res.json({ leaderboard: await getLeaderboardForPoll(req.params.pollId as string) });
});