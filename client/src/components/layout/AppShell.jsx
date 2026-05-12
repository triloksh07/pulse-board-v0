import { BarChart3, LogOut, Plus, RadioTower } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

export function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-black text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-ocean text-white">
              <RadioTower size={19} />
            </span>
            PulseBoard
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/dashboard" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Dashboard
            </NavLink>
            <NavLink to="/poll/create" className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Builder
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-semibold text-slate-600 sm:inline">{user?.name}</span>
            <Button as={Link} to="/poll/create" className="hidden sm:inline-flex">
              <Plus size={16} /> New
            </Button>
            <Button variant="ghost" onClick={handleLogout} aria-label="Logout">
              <LogOut size={17} />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
