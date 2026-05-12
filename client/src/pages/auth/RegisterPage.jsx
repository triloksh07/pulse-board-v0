import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RadioTower } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Field, Input } from "../../components/ui/Field";
import { apiError } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
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
            <h1 className="text-2xl font-black text-ink">Create PulseBoard</h1>
            <p className="text-sm text-slate-500">Start collecting realtime feedback in minutes.</p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <Field label="Name">
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                minLength={8}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </Field>
            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-coral">{error}</p> : null}
            <Button className="w-full">Register</Button>
          </form>
          <p className="text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link className="font-semibold text-ocean" to="/login">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
