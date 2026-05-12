import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Copy, Edit3, Plus, RadioTower, Trophy } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { api, apiError } from "../../services/api";

export function DashboardPage() {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/polls")
      .then(({ data }) => setPolls(data.polls))
      .catch((err) => setError(apiError(err)));
  }, []);

  const stats = useMemo(
    () => ({
      total: polls.length,
      active: polls.filter((poll) => poll.status === "active").length,
      quizzes: polls.filter((poll) => poll.type === "quiz").length,
      published: polls.filter((poll) => poll.published).length,
    }),
    [polls]
  );

  function copyLink(poll) {
    const path = poll.type === "quiz" ? "quiz" : "poll";
    navigator.clipboard?.writeText(`${window.location.origin}/${path}/${poll.shareCode}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-ink">Dashboard</h1>
          <p className="mt-1 text-slate-500">Track active boards, live analytics, and published results.</p>
        </div>
        <Button as={Link} to="/poll/create">
          <Plus size={16} /> Create poll
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total boards", stats.total, RadioTower],
          ["Active", stats.active, BarChart3],
          ["Quizzes", stats.quizzes, Trophy],
          ["Published", stats.published, Copy],
        ].map(([label, value, Icon]) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-black text-ink">{value}</p>
              </div>
              <Icon className="text-ocean" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="font-bold text-ink">Recent boards</h2>
            <p className="text-sm text-slate-500">Share, edit, and inspect realtime performance.</p>
          </div>
        </CardHeader>
        <CardContent>
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-coral">{error}</p> : null}
          {!polls.length && !error ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <p className="font-semibold text-ink">No boards yet</p>
              <p className="mt-1 text-sm text-slate-500">Create your first poll or quiz to open the realtime dashboard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-3">Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Response mode</th>
                    <th>Expires</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {polls.map((poll) => (
                    <tr key={poll._id}>
                      <td className="py-4 font-semibold text-ink">{poll.title}</td>
                      <td>
                        <Badge>{poll.type}</Badge>
                      </td>
                      <td>
                        <Badge className={poll.status === "active" ? "bg-teal-50 text-ocean" : ""}>{poll.status}</Badge>
                      </td>
                      <td>{poll.responseMode}</td>
                      <td>{new Date(poll.expiresAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Button as={Link} to={`/analytics/${poll._id}`} variant="secondary">
                            <BarChart3 size={15} />
                          </Button>
                          <Button as={Link} to={`/poll/${poll._id}/edit`} variant="secondary">
                            <Edit3 size={15} />
                          </Button>
                          <Button type="button" onClick={() => copyLink(poll)} variant="secondary">
                            <Copy size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
