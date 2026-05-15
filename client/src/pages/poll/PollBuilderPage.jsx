import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Copy, Plus, Save, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Field, Input, Select, Textarea } from "../../components/ui/Field";
import { api, apiError } from "../../services/api";

function objectId() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function defaultQuestion(type = "poll") {
  const optionA = objectId();
  const optionB = objectId();
  return {
    // _id: objectId(),
    questionText: "",
    required: true,
    allowMultiple: false,
    points: type === "quiz" ? 1 : 0,
    options: [
      { _id: optionA, text: "" },
      { _id: optionB, text: "" },
    ],
    correctAnswers: type === "quiz" ? [optionA] : [],
  };
}

function emptyPoll() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  return {
    title: "",
    description: "",
    type: "poll",
    responseMode: "anonymous",
    allowMultipleResponses: false,
    showLeaderboard: true,
    realtimeEnabled: true,
    expiresAt: tomorrow,
    questions: [defaultQuestion("poll")],
  };
}

export function PollBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [poll, setPoll] = useState(emptyPoll);
  const [savedPoll, setSavedPoll] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect triggered with editing on builder page:", editing, "id:", id);

    if (!editing) {
      return;
    }

    api
      .get(`/polls/${id}`)
      .then(({ data }) => {

        console.log("poll builder data.poll: ", data.poll);
        console.log("poll builder data.poll: ", data.poll);

        setPoll({
          ...data.poll,
          expiresAt: new Date(data.poll.expiresAt).toISOString().slice(0, 16),
        });
        setSavedPoll(data.poll);
      })
      .catch((err) => setError(apiError(err)));
  }, [editing, id]);

  const shareUrl = useMemo(() => {
    if (!savedPoll?.shareCode) {
      return "";
    }

    const path = savedPoll.type === "quiz" ? "quiz" : "poll";
    return `${window.location.origin}/${path}/${savedPoll.shareCode}`;
  }, [savedPoll]);

  function updateQuestion(index, patch) {
    setPoll((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question
      ),
    }));
  }

  function updateOption(questionIndex, optionIndex, text) {
    setPoll((current) => ({
      ...current,
      questions: current.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentOptionIndex) =>
                currentOptionIndex === optionIndex
                  ? { ...option, text }
                  : option
              ),
            }
          : question
      ),
    }));
  }

  function addOption(questionIndex) {
    setPoll((current) => ({
      ...current,
      questions: current.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: [...question.options, { id: objectId(), text: "" }],
            }
          : question
      ),
    }));
  }

  function removeOption(questionIndex, optionId) {
    setPoll((current) => ({
      ...current,
      questions: current.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.filter(
                (option) => option.id !== optionId
              ),
              correctAnswers: question.correctAnswers.filter(
                (id) => id !== optionId
              ),
            }
          : question
      ),
    }));
  }

  function toggleCorrect(questionIndex, optionId, allowMultiple) {
    const question = poll.questions[questionIndex];
    const correctAnswers = allowMultiple
      ? question.correctAnswers.includes(optionId)
        ? question.correctAnswers.filter((id) => id !== optionId)
        : [...question.correctAnswers, optionId]
      : [optionId];
    updateQuestion(questionIndex, { correctAnswers });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    const payload = {
      ...poll,
      expiresAt: new Date(poll.expiresAt).toISOString(),
      questions: poll.questions.map((question) => ({
        ...question,
        points: poll.type === "quiz" ? Number(question.points || 0) : 0,
        correctAnswers: poll.type === "quiz" ? question.correctAnswers : [],
      })),
    };

    try {
      const { data } = editing
        ? await api.patch(`/polls/${id}`, payload)
        : await api.post("/polls", payload);
      setSavedPoll(data.poll);
      if (!editing) {
        navigate(`/poll/${data.poll._id}/edit`);
      }
    } catch (err) {
      setError(apiError(err));
    }
  }

  async function publish() {
    if (!savedPoll?._id) {
      return;
    }

    const { data } = await api.patch(`/polls/${savedPoll._id}/publish`);
    setSavedPoll(data.poll);
  }

  function downloadQr() {
    const canvas = document.getElementById("share-qr");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "pulseboard-qr.png";
    link.click();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form className="space-y-6" onSubmit={submit}>
        <div>
          <h1 className="text-3xl font-black text-ink">
            {editing ? "Edit board" : "Create board"}
          </h1>
          <p className="mt-1 text-slate-500">
            Build a realtime poll or quiz with shareable public access.
          </p>
        </div>
        {error ? (
          <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-coral">
            {error}
          </p>
        ) : null}

        <Card>
          <CardHeader>
            <h2 className="font-bold text-ink">Basics</h2>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <Input
                value={poll.title}
                onChange={(event) =>
                  setPoll({ ...poll, title: event.target.value })
                }
                required
              />
            </Field>
            <Field label="Mode">
              <Select
                value={poll.type}
                onChange={(event) =>
                  setPoll({
                    ...poll,
                    type: event.target.value,
                    questions: poll.questions.map((question) => ({
                      ...question,
                      points:
                        event.target.value === "quiz"
                          ? question.points || 1
                          : 0,
                    })),
                  })
                }
              >
                <option value="poll">Poll</option>
                <option value="quiz">Quiz</option>
              </Select>
            </Field>
            <Field label="Description">
              <Textarea
                value={poll.description}
                onChange={(event) =>
                  setPoll({ ...poll, description: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4">
              <Field label="Response mode">
                <Select
                  value={poll.responseMode}
                  onChange={(event) =>
                    setPoll({ ...poll, responseMode: event.target.value })
                  }
                >
                  <option value="anonymous">Anonymous</option>
                  <option value="authenticated">Authenticated</option>
                </Select>
              </Field>
              <Field label="Expires at">
                <Input
                  type="datetime-local"
                  value={poll.expiresAt}
                  onChange={(event) =>
                    setPoll({ ...poll, expiresAt: event.target.value })
                  }
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {poll.questions.map((question, questionIndex) => (
          <Card key={question.id || questionIndex}>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="font-bold text-ink">
                Question {questionIndex + 1}
              </h2>
              {poll.questions.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setPoll({
                      ...poll,
                      questions: poll.questions.filter(
                        (_, index) => index !== questionIndex
                      ),
                    })
                  }
                >
                  <Trash2 size={16} />
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Question text">
                <Input
                  value={question.questionText}
                  onChange={(event) =>
                    updateQuestion(questionIndex, {
                      questionText: event.target.value,
                    })
                  }
                  required
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        required: event.target.checked,
                      })
                    }
                  />
                  Required
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={question.allowMultiple}
                    onChange={(event) =>
                      updateQuestion(questionIndex, {
                        allowMultiple: event.target.checked,
                        correctAnswers: [],
                      })
                    }
                  />
                  Multiple choice
                </label>
                {poll.type === "quiz" ? (
                  <Field label="Points">
                    <Input
                      type="number"
                      min="0"
                      value={question.points}
                      onChange={(event) =>
                        updateQuestion(questionIndex, {
                          points: event.target.value,
                        })
                      }
                    />
                  </Field>
                ) : null}
              </div>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={option.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-2"
                  >
                    <Input
                      value={option.text}
                      onChange={(event) =>
                        updateOption(
                          questionIndex,
                          optionIndex,
                          event.target.value
                        )
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    {poll.type === "quiz" ? (
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <input
                          type={question.allowMultiple ? "checkbox" : "radio"}
                          name={`correct-${questionIndex}`}
                          checked={question.correctAnswers.includes(option.id)}
                          onChange={() =>
                            toggleCorrect(
                              questionIndex,
                              option.id,
                              question.allowMultiple
                            )
                          }
                        />
                        Correct
                      </label>
                    ) : null}
                    {question.options.length > 2 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeOption(questionIndex, option.id)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addOption(questionIndex)}
              >
                <Plus size={16} /> Option
              </Button>
            </CardContent>
          </Card>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setPoll({
                ...poll,
                questions: [...poll.questions, defaultQuestion(poll.type)],
              })
            }
          >
            <Plus size={16} /> Question
          </Button>
          <Button>
            <Save size={16} /> Save board
          </Button>
        </div>
      </form>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <h2 className="font-bold text-ink">Share</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {shareUrl ? (
              <>
                <div className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600 break-all">
                  {shareUrl}
                </div>
                <div className="grid place-items-center rounded-md border border-slate-200 p-4">
                  <QRCodeCanvas
                    id="share-qr"
                    value={shareUrl}
                    size={180}
                    includeMargin
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigator.clipboard?.writeText(shareUrl)}
                  >
                    <Copy size={16} /> Copy
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={downloadQr}
                  >
                    Download QR
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={publish}
                  variant={savedPoll?.published ? "secondary" : "primary"}
                >
                  {savedPoll?.published ? "Published" : "Publish results"}
                </Button>
                {savedPoll?.published ? (
                  <Button
                    as={Link}
                    to={`/results/${savedPoll.shareCode}`}
                    variant="secondary"
                  >
                    View results
                  </Button>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Save the board to generate a public link and QR code.
              </p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
