import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RadioTower } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Field, Input } from "../../components/ui/Field";
import { apiError } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // const login = useAuthStore((state) => state.login);
  const { user, login, ready } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) {
      navigate(location.state?.from || "/dashboard", { replace: true });
    }
  }, [user, ready, navigate, location]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form);
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-md bg-ocean text-white">
              <RadioTower />
            </span>
            <h1 className="text-2xl font-black text-ink">Welcome back</h1>
            <p className="text-sm text-slate-500">
              Run live polls and quizzes from your dashboard.
            </p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
            </Field>
            {error ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-coral">
                {error}
              </p>
            ) : null}
            <Button className="w-full">Login</Button>
          </form>
          <p className="text-center text-sm text-slate-500">
            New here?{" "}
            <Link className="font-semibold text-ocean" to="/register">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
