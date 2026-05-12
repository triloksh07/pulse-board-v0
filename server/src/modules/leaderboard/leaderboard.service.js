import { Response } from "../responses/response.model.js";

export async function getLeaderboardForPoll(pollId, limit = 25) {
  const responses = await Response.find({ pollId })
    .populate("userId", "name email avatar")
    .sort({ score: -1, completionTime: 1, submittedAt: 1 })
    .limit(limit);

  return responses.map((response, index) => ({
    rank: index + 1,
    participant: response.userId?.name || response.anonymousName || "Anonymous",
    score: response.score,
    completionTime: response.completionTime,
    submittedAt: response.submittedAt,
  }));
}
