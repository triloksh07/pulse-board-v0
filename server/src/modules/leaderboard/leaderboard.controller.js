import { asyncHandler } from "../../utils/asyncHandler.js";
import { getOwnedPoll } from "../polls/poll.service.js";
import { getLeaderboardForPoll } from "./leaderboard.service.js";

export const show = asyncHandler(async (req, res) => {
  await getOwnedPoll(req.params.pollId, req.user._id);
  res.json({ leaderboard: await getLeaderboardForPoll(req.params.pollId) });
});
