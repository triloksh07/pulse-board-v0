import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { api, apiError } from "../../services/api";
import { getSocket } from "../../services/socket.js";

export function ResultsPage() {
  const { shareCode } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = getSocket();

    async function fetchAnalytics() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/polls/share/${shareCode}`);

        const poll = response.data?.poll ?? response.data?.data?.poll;

        if (!poll?.id) {
          throw new Error("Invalid poll");
        }

        socket.emit("poll:join", {
          pollId: poll.id,
        });

        const analyticsResponse = await api.get(`/analytics/${poll.id}/public`);

        const analytics =
          analyticsResponse.data?.data?.analytics ||
          analyticsResponse.data?.analytics;

        setAnalytics(analytics);
      } catch (err) {
        console.error(err);
        setError(apiError(err));
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();

    socket.on("poll:updated", (updatedAnalytics) => {
      if (!updatedAnalytics) return;

      setAnalytics(updatedAnalytics);
    });

    return () => {
      socket.off("poll:updated");
    };
  }, [shareCode]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="text-center">
            <h1 className="text-2xl font-black text-ink">
              Results unavailable
            </h1>
            <p className="mt-2 text-coral">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }


  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center text-sm font-semibold text-slate-600">
        Loading results...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div>
        <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-ocean">
          Published results
        </span>
        <h1 className="mt-3 text-4xl font-black text-ink">
          {analytics.poll.title}
        </h1>
        <p className="mt-2 text-slate-500">{analytics.poll.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-slate-500">
              Total responses
            </p>
            <p className="mt-2 text-4xl font-black text-ink">
              {analytics.totalResponses}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-slate-500">Average time</p>
            <p className="mt-2 text-4xl font-black text-ink">
              {analytics.averageCompletionTime}s
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-slate-500">Mode</p>
            <p className="mt-2 text-4xl font-black capitalize text-ink">
              {analytics.poll.type}
            </p>
          </CardContent>
        </Card>
      </div>

      {analytics.questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <h2 className="font-bold text-ink">{question.questionText}</h2>
            <p className="text-sm text-slate-500">
              {question.participationRate}% participation
            </p>
          </CardHeader>
          <CardContent className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={question.options}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="text" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option.id} className="rounded-md bg-slate-50 p-3">
                  <div className="flex justify-between gap-3 text-sm font-semibold">
                    <span>{option.text}</span>
                    <span>{option.percentage}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-ocean"
                      style={{ width: `${option.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
