import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { emitPollPublished } from "../../sockets/emitters/poll.emitters.js";
import {
  createPoll,
  deletePoll,
  getOwnedPoll,
  getPublicPoll,
  listPolls,
  publishPoll,
  updatePoll,
} from "./poll.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const poll = await createPoll(req.body, req.user._id);
  res.status(201).json({ poll });
});

export const index = asyncHandler(async (req: Request, res: Response) => {
  res.json({ polls: await listPolls(req.user._id) });
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  res.json({ poll: await getOwnedPoll(req.params.id as string, req.user._id) });
});

export const showByShareCode = asyncHandler(
  async (req: Request, res: Response) => {
    const shareCode = req.params.shareCode as string;
    res.json({ poll: await getPublicPoll(shareCode) });
  }
);

export const update = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    poll: await updatePoll(req.params.id as string, req.body, req.user._id),
  });
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  res.json(await deletePoll(req.params.id as string, req.user._id));
});

export const publish = asyncHandler(async (req: Request, res: Response) => {
  const poll = await publishPoll(req.params.id as string, req.user._id);

  const io = req.app.get("io");

  emitPollPublished(io, poll._id.toString(), {
    pollId: poll._id,
    shareCode: poll.shareCode,
    published: true,
  });
  res.json({ poll });
});
