import { Poll } from "../polls/poll.model.js";
import { Response } from "../responses/response.model.js";
import { HttpError, notFound } from "../../utils/httpError.js";

interface AnalyticsOptions {
  publicOnly?: boolean;
}

function asId(value: any): string | undefined {
  return value?.toString();
}

function buildQuestionAnalytics(poll: any, responses: any[]) {
  return poll.questions.map((question: any) => {
    const options = question.options.map((option: any) => {
      const count = responses.reduce((sum: number, response: any) => {
        const answer = response.answers.find(
          (item: any) => asId(item.questionId) === asId(question._id)
        );
        return (
          sum +
          (answer?.selectedOptions.some(
            (id: any) => asId(id) === asId(option._id)
          )
            ? 1
            : 0)
        );
      }, 0);

      return {
        id: option._id,
        text: option.text,
        count,
        percentage: responses.length
          ? Math.round((count / responses.length) * 100)
          : 0,
      };
    });

    const answeredCount = responses.filter((response: any) =>
      response.answers.some(
        (answer: any) =>
          asId(answer.questionId) === asId(question._id) &&
          answer.selectedOptions.length
      )
    ).length;

    return {
      id: question._id,
      questionText: question.questionText,
      required: question.required,
      allowMultiple: question.allowMultiple,
      participationCount: answeredCount,
      participationRate: responses.length
        ? Math.round((answeredCount / responses.length) * 100)
        : 0,
      options,
    };
  });
}

function buildTimeline(responses: any[]) {
  const buckets = new Map<string, number>();

  for (const response of responses) {
    const key = response.submittedAt.toISOString().slice(0, 13) + ":00";
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, count]) => ({ time, count }));
}

export async function getAnalyticsForPoll(
  pollId: string,
  userId: string | null = null,
  { publicOnly = false }: AnalyticsOptions = {}
) {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw notFound("Poll not found");
  }

  if (!publicOnly && userId && !poll.createdBy.equals(userId)) {
    throw new HttpError(403, "You do not have access to this poll");
  }

  if (publicOnly && !poll.published) {
    throw new HttpError(403, "Results have not been published");
  }

  const responses = await Response.find({ pollId: poll._id }).sort({
    submittedAt: 1,
  });

  const totalResponses = responses.length;
  const scores: number[] = responses.map((response: any) => response.score);
  const completionTimes: number[] = responses
    .map((response: any) => response.completionTime)
    .filter(Boolean);

  const maxPossibleScore = poll.questions.reduce(
    (sum: number, question: any) => sum + (question.points || 0),
    0
  );

  return {
    poll: {
      id: poll._id,
      title: poll.title,
      description: poll.description,
      type: poll.type,
      shareCode: poll.shareCode,
      status: poll.status,
      published: poll.published,
      expiresAt: poll.expiresAt,
      responseMode: poll.responseMode,
    },
    totalResponses,
    completionRate: totalResponses ? 100 : 0,
    averageCompletionTime: completionTimes.length
      ? Math.round(
          completionTimes.reduce((sum, value) => sum + value, 0) /
            completionTimes.length
        )
      : 0,
    timeline: buildTimeline(responses),
    questions: buildQuestionAnalytics(poll, responses),
    quiz:
      poll.type === "quiz"
        ? {
            maxPossibleScore,
            averageScore: scores.length
              ? Number(
                  (
                    scores.reduce((sum, value) => sum + value, 0) /
                    scores.length
                  ).toFixed(2)
                )
              : 0,
            highestScore: scores.length ? Math.max(...scores) : 0,
            lowestScore: scores.length ? Math.min(...scores) : 0,
          }
        : null,
  };
}
