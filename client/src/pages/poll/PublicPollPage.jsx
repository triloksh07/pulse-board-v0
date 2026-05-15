import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, RadioTower } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Field, Input } from "../../components/ui/Field";

import { api, apiError } from "../../services/api";

export function PublicPollPage() {
  const { shareCode } = useParams();

  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [anonymousName, setAnonymousName] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startedAt] = useState(Date.now());

  useEffect(() => {
    async function fetchPoll() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/polls/share/${shareCode}`);

        console.log("poll response:", response.data);

        const pollData =
          response.data?.poll ||
          response.data?.data?.poll ||
          response.data?.data;

        if (!pollData?.id) {
          throw new Error("Invalid poll response");
        }

        setPoll(pollData);
      } catch (err) {
        console.error(err);
        setError(apiError(err));
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
  }, [shareCode]);

  const isUnavailable = useMemo(() => {
    if (!poll) return false;

    return (
      poll.status === "published" ||
      poll.status === "expired" ||
      new Date(poll.expiresAt).getTime() <= Date.now()
    );
  }, [poll]);

  function setSelection(question, optionId, checked) {
    const current = answers[question.id] || [];

    const selectedOptions = question.allowMultiple
      ? checked
        ? [...current, optionId]
        : current.filter((id) => id !== optionId)
      : [optionId];

    setAnswers((prev) => ({
      ...prev,
      [question.id]: selectedOptions,
    }));
  }

  async function submit(event) {
    event.preventDefault();

    try {
      setError("");

      if (!poll?.id) {
        throw new Error("Poll not loaded");
      }

      await api.post(`/responses/${poll.id}`, {
        anonymousName,
        completionTime: Math.round((Date.now() - startedAt) / 1000),

        answers: poll.questions.map((question) => ({
          questionId: question.id,
          selectedOptions: answers[question.id] || [],
        })),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(apiError(err));
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center text-sm font-semibold text-slate-600">
        Loading board...
      </main>
    );
  }

  if (error && !poll) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-coral">{error}</main>
    );
  }

  if (!poll) {
    return <main className="mx-auto max-w-3xl px-4 py-10">Poll not found</main>;
  }

  if (submitted) {
    return (
      <main className="mx-auto grid min-h-screen max-w-2xl place-items-center px-4 py-10">
        <Card className="w-full text-center">
          <CardContent className="space-y-4">
            <CheckCircle2 className="mx-auto text-ocean" size={44} />

            <h1 className="text-2xl font-black text-ink">Response submitted</h1>

            <p className="text-slate-500">
              Thanks for adding your signal to {poll.title}.
            </p>

            {poll.published ? (
              <Button as={Link} to={`/results/${poll.shareCode}`}>
                View results
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </main>
    );
  }

  if (isUnavailable) {
    return (
      <main className="mx-auto grid min-h-screen max-w-2xl place-items-center px-4 py-10">
        <Card className="w-full">
          <CardContent className="space-y-3 text-center">
            <RadioTower className="mx-auto text-ocean" />

            <h1 className="text-2xl font-black text-ink">{poll.title}</h1>

            <p className="text-slate-500">
              This board is no longer accepting responses.
            </p>

            {poll.published ? (
              <Button as={Link} to={`/results/${poll.shareCode}`}>
                View published results
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <form className="space-y-5" onSubmit={submit}>
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-ocean">
            {poll.type}
          </span>

          <h1 className="text-4xl font-black text-ink">{poll.title}</h1>

          <p className="text-slate-500">{poll.description}</p>
        </div>

        {poll.responseMode === "anonymous" ? (
          <Field label="Display name">
            <Input
              value={anonymousName}
              placeholder="Anonymous"
              onChange={(event) => setAnonymousName(event.target.value)}
            />
          </Field>
        ) : (
          <p className="rounded-md bg-gold/20 p-3 text-sm font-semibold text-ink">
            Login is required for this board.
          </p>
        )}

        {poll.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <h2 className="font-bold text-ink">
                {index + 1}. {question.questionText}
              </h2>
            </CardHeader>

            <CardContent className="space-y-3">
              {question.options.map((option) => (
                <label
                  key={option._id}
                  className="flex items-center gap-3 rounded-md border border-slate-200 p-3 text-sm font-semibold text-slate-700"
                >
                  <input
                    type={question.allowMultiple ? "checkbox" : "radio"}
                    name={question.id}
                    checked={(answers[question.id] || []).includes(option._id)}
                    onChange={(event) =>
                      setSelection(question, option._id, event.target.checked)
                    }
                  />

                  {option.text}
                </label>
              ))}
            </CardContent>
          </Card>
        ))}

        {error ? (
          <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-coral">
            {error}
          </p>
        ) : null}

        <Button className="w-full">Submit response</Button>
      </form>
    </main>
  );
}
