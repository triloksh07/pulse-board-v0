import { nanoid } from "nanoid";
import { Poll } from "./poll.model.js";
import { HttpError, notFound } from "../../utils/httpError.js";
import { CreatePollInput, UpdatePollInput } from "./poll.validation.js";

function normalizeStatus(poll: any) {
  if (!poll) {
    return poll;
  }

  if (
    !poll.published &&
    poll.status !== "draft" &&
    poll.expiresAt &&
    new Date(poll.expiresAt).getTime() <= Date.now()
  ) {
    poll.status = "expired";
  }

  return poll;
}

function serializePublicPoll(poll: any) {
  const pollObj = poll.toObject();

  const safeQuestions = pollObj.questions.map((q: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { correctAnswers, _id, ...safeQuestion } = q;
    return { id: _id, ...safeQuestion };
  });

  return {
    id: pollObj._id,
    title: pollObj.title,
    description: pollObj.description,
    type: pollObj.type,
    shareCode: pollObj.shareCode,
    status: pollObj.status,
    responseMode: pollObj.responseMode,
    allowMultipleResponses: pollObj.allowMultipleResponses,
    showLeaderboard: pollObj.showLeaderboard,
    realtimeEnabled: pollObj.realtimeEnabled,
    published: pollObj.published,
    expiresAt: pollObj.expiresAt,
    questions: safeQuestions,
  };
}

function ensureOwner(poll: any, userId: string) {
  if (!poll.createdBy.equals(userId)) {
    throw new HttpError(403, "You do not have access to this poll");
  }
}

function validateQuizAnswers(input: any) {
  if (input.type !== "quiz" || !input.questions) {
    return;
  }

  for (const question of input.questions) {
    const optionIds = new Set(
      question.options
        .filter((option: any) => option._id)
        .map((option: any) => option._id)
    );

    for (const correctAnswer of question.correctAnswers || []) {
      if (optionIds.size > 0 && !optionIds.has(correctAnswer)) {
        throw new HttpError(
          400,
          "Correct answers must reference options in the same question"
        );
      }
    }
  }
}

export async function createPoll(input: CreatePollInput, userId: string) {
  validateQuizAnswers(input);

  return Poll.create({
    ...input,
    shareCode: nanoid(10),
    createdBy: userId,
    status: "active",
    published: false,
  });
}

export async function listPolls(userId: string) {
  const polls = await Poll.find({ createdBy: userId }).sort({ createdAt: -1 });
  return polls.map(normalizeStatus);
}

export async function getOwnedPoll(id: string, userId: string) {
  const poll = normalizeStatus(await Poll.findById(id));

  if (!poll) {
    throw notFound("Poll not found");
  }

  ensureOwner(poll, userId);
  return poll;
}

export async function getPublicPoll(shareCode: string) {
  const poll = normalizeStatus(await Poll.findOne({ shareCode }));

  if (!poll) {
    throw notFound("Poll not found");
  }

  return serializePublicPoll(poll);
}

export async function updatePoll(
  id: string,
  input: UpdatePollInput,
  userId: string
) {
  validateQuizAnswers(input);

  const poll = await getOwnedPoll(id, userId);

  const isExpired =
    input.expiresAt && new Date(input.expiresAt).getTime() <= Date.now();

  Object.assign(poll, input, {
    status: isExpired ? "expired" : "active",
    published: false,
  });

  return poll.save();
}

export async function deletePoll(id: string, userId: string) {
  const poll = await getOwnedPoll(id, userId);
  await poll.deleteOne();
  return { message: "Poll deleted" };
}

export async function publishPoll(id: string, userId: string) {
  const poll = await getOwnedPoll(id, userId);

  if (poll.published) {
    throw new HttpError(400, "This poll is already published");
  }

  poll.published = true;
  poll.status = "published";
  return poll.save();
}
