import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export function ProtectedRoute() {
  const location = useLocation();
  const { user, ready } = useCurrentUser();

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-600">Loading PulseBoard...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
