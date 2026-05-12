import { asyncHandler } from "../../utils/asyncHandler.js";
import { getAnalyticsForPoll } from "./analytics.service.js";

export const show = asyncHandler(async (req, res) => {
  res.json({ analytics: await getAnalyticsForPoll(req.params.pollId, req.user._id) });
});

export const showPublic = asyncHandler(async (req, res) => {
  res.json({ analytics: await getAnalyticsForPoll(req.params.pollId, null, { publicOnly: true }) });
});
