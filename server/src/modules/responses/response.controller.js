import { asyncHandler } from "../../utils/asyncHandler.js";
import { emitResponseUpdates } from "../../sockets/poll.socket.js";
import { getResponsesForPoll, submitResponse } from "./response.service.js";

export const create = asyncHandler(async (req, res) => {
  const response = await submitResponse(req.params.pollId, req.body, req.user);
  await emitResponseUpdates(req.params.pollId);
  res.status(201).json({ response });
});

export const index = asyncHandler(async (req, res) => {
  res.json({ responses: await getResponsesForPoll(req.params.pollId, req.user._id) });
});
