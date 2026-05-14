import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import pollRoutes from "./modules/polls/poll.routes.js";
import responseRoutes from "./modules/responses/response.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 500,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    })
  );

  app.get("/health", (req, res) => {
    res.json({ ok: true, service: "pulseboard-api" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/polls", pollRoutes);
  app.use("/api/responses", responseRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
