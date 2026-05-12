import { asyncHandler } from "../../utils/asyncHandler.js";
import { emitPollPublished } from "../../sockets/poll.socket.js";
import {
  createPoll,
  deletePoll,
  getOwnedPoll,
  getPublicPoll,
  listPolls,
  publishPoll,
  updatePoll,
} from "./poll.service.js";

export const create = asyncHandler(async (req, res) => {
  const poll = await createPoll(req.body, req.user._id);
  res.status(201).json({ poll });
});

export const index = asyncHandler(async (req, res) => {
  res.json({ polls: await listPolls(req.user._id) });
});

export const show = asyncHandler(async (req, res) => {
  res.json({ poll: await getOwnedPoll(req.params.id, req.user._id) });
});

export const showByShareCode = asyncHandler(async (req, res) => {
  res.json({ poll: await getPublicPoll(req.params.shareCode) });
});

export const update = asyncHandler(async (req, res) => {
  res.json({ poll: await updatePoll(req.params.id, req.body, req.user._id) });
});

export const destroy = asyncHandler(async (req, res) => {
  res.json(await deletePoll(req.params.id, req.user._id));
});

export const publish = asyncHandler(async (req, res) => {
  const poll = await publishPoll(req.params.id, req.user._id);
  emitPollPublished(poll._id, { pollId: poll._id, shareCode: poll.shareCode, published: true });
  res.json({ poll });
});
