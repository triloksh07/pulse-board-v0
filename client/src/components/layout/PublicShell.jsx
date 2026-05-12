import { RadioTower } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/Button";

export function PublicShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-black text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-ocean text-white">
              <RadioTower size={19} />
            </span>
            PulseBoard
          </Link>
          <div className="flex gap-2">
            <Button as={Link} to="/login" variant="secondary">
              Login
            </Button>
            <Button as={Link} to="/register">
              Register
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
