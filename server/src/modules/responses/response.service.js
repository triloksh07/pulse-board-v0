import { Poll } from "../polls/poll.model.js";
import { Response } from "./response.model.js";
import { HttpError, notFound } from "../../utils/httpError.js";

function id(value) {
  return value?.toString();
}

function setFrom(values) {
  return new Set(values.map((value) => id(value)));
}

function calculateScore(poll, answers) {
  if (poll.type !== "quiz") {
    return 0;
  }

  let score = 0;

  for (const question of poll.questions) {
    const answer = answers.find((item) => id(item.questionId) === id(question._id));
    const selected = setFrom(answer?.selectedOptions || []);
    const correct = setFrom(question.correctAnswers || []);

    if (!correct.size) {
      continue;
    }

    const exactMatch = selected.size === correct.size && [...selected].every((value) => correct.has(value));

    if (exactMatch) {
      score += question.points || 0;
    }
  }

  return score;
}

function validateAnswerPayload(poll, answers) {
  const answerMap = new Map(answers.map((answer) => [id(answer.questionId), answer]));

  for (const question of poll.questions) {
    const answer = answerMap.get(id(question._id));
    const selectedOptions = answer?.selectedOptions || [];

    if (question.required && selectedOptions.length === 0) {
      throw new HttpError(400, `Question is required: ${question.questionText}`);
    }

    if (!question.allowMultiple && selectedOptions.length > 1) {
      throw new HttpError(400, `Question allows only one option: ${question.questionText}`);
    }

    const validOptions = setFrom(question.options.map((option) => option._id));
    for (const optionId of selectedOptions) {
      if (!validOptions.has(id(optionId))) {
        throw new HttpError(400, "Response contains an invalid option");
      }
    }
  }

  for (const answer of answers) {
    if (!poll.questions.some((question) => id(question._id) === id(answer.questionId))) {
      throw new HttpError(400, "Response contains an invalid question");
    }
  }
}

export async function submitResponse(pollId, input, user = null) {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw notFound("Poll not found");
  }

  if (poll.published || poll.status === "published") {
    throw new HttpError(400, "This poll has already published final results");
  }

  if (poll.status === "draft") {
    throw new HttpError(400, "This poll is not accepting responses yet");
  }

  if (poll.expiresAt.getTime() <= Date.now() || poll.status === "expired") {
    poll.status = "expired";
    await poll.save();
    throw new HttpError(400, "This poll has expired");
  }

  if (poll.responseMode === "authenticated" && !user) {
    throw new HttpError(401, "Please login to answer this poll");
  }

  if (!poll.allowMultipleResponses && user) {
    const existing = await Response.exists({ pollId: poll._id, userId: user._id });
    if (existing) {
      throw new HttpError(409, "You have already submitted a response");
    }
  }

  validateAnswerPayload(poll, input.answers);

  return Response.create({
    pollId: poll._id,
    userId: user?._id || null,
    anonymousName: input.anonymousName || user?.name || "Anonymous",
    answers: input.answers,
    completionTime: input.completionTime,
    score: calculateScore(poll, input.answers),
  });
}

export async function getResponsesForPoll(pollId, userId) {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw notFound("Poll not found");
  }

  if (!poll.createdBy.equals(userId)) {
    throw new HttpError(403, "You do not have access to these responses");
  }

  return Response.find({ pollId }).sort({ submittedAt: -1 });
}
