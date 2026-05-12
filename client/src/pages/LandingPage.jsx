import { BarChart3, QrCode, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function LandingPage() {
  return (
    <main>
      <section className="bg-ink text-white">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-teal-100">
              Realtime polls, feedback, and live quizzes
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-6xl">PulseBoard</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200">
                Create shareable polls, collect responses, watch analytics update live, and publish final results from one focused SaaS dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to="/register">
                Start building
              </Button>
              <Button as={Link} to="/login" variant="secondary">
                Host login
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-soft">
            <div className="grid gap-3">
              {[
                ["Event pulse", "148 responses", "72% completion"],
                ["Live quiz", "26 players", "Leaderboard active"],
                ["Product feedback", "42 responses", "Results published"],
              ].map((item) => (
                <div key={item[0]} className="rounded-md bg-white p-4 text-ink">
                  <div className="flex items-center justify-between">
                    <strong>{item[0]}</strong>
                    <span className="text-sm font-semibold text-ocean">{item[1]}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item[2]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-4">
        {[
          [Zap, "Realtime rooms"],
          [BarChart3, "Live analytics"],
          [Trophy, "Quiz rankings"],
          [QrCode, "QR sharing"],
        ].map(([Icon, title]) => (
          <div key={title} className="rounded-lg border border-slate-200 bg-white p-5">
            <Icon className="text-ocean" />
            <h2 className="mt-4 font-bold text-ink">{title}</h2>
          </div>
        ))}
      </section>
    </main>
  );
}
