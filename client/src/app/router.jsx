import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppShell } from "../components/layout/AppShell";
import { PublicShell } from "../components/layout/PublicShell";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { PollBuilderPage } from "../pages/poll/PollBuilderPage";
import { PublicPollPage } from "../pages/poll/PublicPollPage";
import { AnalyticsPage } from "../pages/analytics/AnalyticsPage";
import { ResultsPage } from "../pages/results/ResultsPage";

export const router = createBrowserRouter([
  {
    element: <PublicShell />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/poll/:shareCode", element: <PublicPollPage /> },
      { path: "/quiz/:shareCode", element: <PublicPollPage /> },
      { path: "/results/:shareCode", element: <ResultsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/poll/create", element: <PollBuilderPage /> },
          { path: "/poll/:id/edit", element: <PollBuilderPage /> },
          { path: "/analytics/:pollId", element: <AnalyticsPage /> },
          { path: "/settings", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
]);
