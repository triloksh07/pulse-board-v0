import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ExternalLink, RadioTower } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { api, apiError } from "../../services/api";
import { getSocket } from "../../services/socket";

export function AnalyticsPage() {
  const { pollId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get(`/analytics/${pollId}`), api.get(`/leaderboard/${pollId}`)])
      .then(([analyticsResponse, leaderboardResponse]) => {
        setAnalytics(analyticsResponse.data.analytics);
        setLeaderboard(leaderboardResponse.data.leaderboard);
      })
      .catch((err) => setError(apiError(err)));

    const socket = getSocket();
    socket.emit("join_poll", { pollId });
    socket.on("analytics_updated", (payload) => {
      if (payload.pollId === pollId) {
        setAnalytics(payload.analytics);
      }
    });
    socket.on("leaderboard_updated", (payload) => {
      if (payload.pollId === pollId) {
        setLeaderboard(payload.leaderboard);
      }
    });
    socket.on("poll_published", () => {
      setAnalytics((current) => current && { ...current, poll: { ...current.poll, published: true, status: "published" } });
    });

    return () => {
      socket.emit("leave_poll", { pollId });
      socket.off("analytics_updated");
      socket.off("leaderboard_updated");
      socket.off("poll_published");
    };
  }, [pollId]);

  if (error) {
    return <p className="text-coral">{error}</p>;
  }

  if (!analytics) {
    return <p className="text-sm font-semibold text-slate-600">Loading analytics...</p>;
  }

  const optionRows = analytics.questions.flatMap((question) =>
    question.options.map((option) => ({ question: question.questionText.slice(0, 22), option: option.text, count: option.count }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-ink">{analytics.poll.title}</h1>
          <p className="mt-1 text-slate-500">Live analytics update as participants submit responses.</p>
        </div>
        <Button as={Link} to={`/results/${analytics.poll.shareCode}`} variant="secondary">
          <ExternalLink size={16} /> Results
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Responses", analytics.totalResponses],
          ["Completion", `${analytics.completionRate}%`],
          ["Avg time", `${analytics.averageCompletionTime}s`],
          ["Status", analytics.poll.status],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-ink">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <h2 className="font-bold text-ink">Option distribution</h2>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={optionRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="option" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-bold text-ink">Leaderboard</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.length ? (
              leaderboard.map((entry) => (
                <div key={`${entry.rank}-${entry.participant}`} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                  <div>
                    <p className="font-bold text-ink">
                      #{entry.rank} {entry.participant}
                    </p>
                    <p className="text-xs text-slate-500">{entry.completionTime}s</p>
                  </div>
                  <span className="font-black text-ocean">{entry.score}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Leaderboard appears after quiz submissions.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <RadioTower className="text-ocean" />
          <h2 className="font-bold text-ink">Participation timeline</h2>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#e35d45" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
