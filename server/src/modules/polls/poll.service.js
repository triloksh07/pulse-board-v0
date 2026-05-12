import { nanoid } from "nanoid";
import { Poll } from "./poll.model.js";
import { HttpError, notFound } from "../../utils/httpError.js";

function normalizeStatus(poll) {
  if (!poll) {
    return poll;
  }

  if (!poll.published && poll.status !== "draft" && poll.expiresAt.getTime() <= Date.now()) {
    poll.status = "expired";
  }

  return poll;
}

function ensureOwner(poll, userId) {
  if (!poll.createdBy.equals(userId)) {
    throw new HttpError(403, "You do not have access to this poll");
  }
}

function validateQuizAnswers(input) {
  if (input.type !== "quiz") {
    return;
  }

  for (const question of input.questions) {
    const optionIds = new Set(question.options.filter((option) => option._id).map((option) => option._id));
    for (const correctAnswer of question.correctAnswers || []) {
      if (optionIds.size > 0 && !optionIds.has(correctAnswer)) {
        throw new HttpError(400, "Correct answers must reference options in the same question");
      }
    }
  }
}

export async function createPoll(input, userId) {
  validateQuizAnswers(input);

  return Poll.create({
    ...input,
    shareCode: nanoid(10),
    createdBy: userId,
    status: "active",
    published: false,
  });
}

export async function listPolls(userId) {
  const polls = await Poll.find({ createdBy: userId }).sort({ createdAt: -1 });
  return polls.map(normalizeStatus);
}

export async function getOwnedPoll(id, userId) {
  const poll = normalizeStatus(await Poll.findById(id));

  if (!poll) {
    throw notFound("Poll not found");
  }

  ensureOwner(poll, userId);
  return poll;
}

export async function getPublicPoll(shareCode) {
  const poll = normalizeStatus(await Poll.findOne({ shareCode }));

  if (!poll) {
    throw notFound("Poll not found");
  }

  return poll;
}

export async function updatePoll(id, input, userId) {
  validateQuizAnswers(input);

  const poll = await getOwnedPoll(id, userId);
  Object.assign(poll, input, {
    status: input.expiresAt.getTime() <= Date.now() ? "expired" : "active",
    published: false,
  });

  return poll.save();
}

export async function deletePoll(id, userId) {
  const poll = await getOwnedPoll(id, userId);
  await poll.deleteOne();
  return { message: "Poll deleted" };
}

export async function publishPoll(id, userId) {
  const poll = await getOwnedPoll(id, userId);
  poll.published = true;
  poll.status = "published";
  return poll.save();
}
