import { Server } from "socket.io";
import { env } from "../config/env.js";
import { getAnalyticsForPoll } from "../modules/analytics/analytics.service.js";
import { getLeaderboardForPoll } from "../modules/leaderboard/leaderboard.service.js";

let ioInstance = null;

function roomName(pollId) {
  return `poll:${pollId}`;
}

/**
 * type roomType = "poll" | "quiz" | "chat";
 * function roomName(roomType: roomType, pollId: string) {
 *   return `${roomType}:${pollId}`;
 * }
 */

export function initSockets(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);
    socket.on("join_poll", ({ pollId }) => {
      if (pollId) {
        try {
          socket.join(roomName(pollId));
          console.log(`Socket ${socket.id} joined room ${roomName(pollId)}`);
        } catch (e) {
          console.error("Error joining poll room: ", e);
        }
      }
    });

    socket.on("leave_poll", ({ pollId }) => {
      if (pollId) {
        socket.leave(roomName(pollId));
        console.log(`Socket ${socket.id} left room ${roomName(pollId)}`);
      }
    });

    socket.on("request_leaderboard", async ({ pollId }) => {
      if (!pollId) {
        return;
      }

      const leaderboard = await getLeaderboardForPoll(pollId);
      socket.emit("leaderboard_updated", { pollId, leaderboard });
    });
  });

  return ioInstance;
}

export function emitPollPublished(pollId, payload) {
  ioInstance?.to(roomName(pollId)).emit("poll_published", payload);
}

export function emitPollExpired(pollId, payload) {
  ioInstance?.to(roomName(pollId)).emit("poll_expired", payload);
}

export async function emitResponseUpdates(pollId) {
  if (!ioInstance) {
    return;
  }

  const [analytics, leaderboard] = await Promise.all([
    getAnalyticsForPoll(pollId),
    getLeaderboardForPoll(pollId),
  ]);

  ioInstance.to(roomName(pollId)).emit("response_count_updated", {
    pollId,
    totalResponses: analytics.totalResponses,
  });
  ioInstance
    .to(roomName(pollId))
    .emit("analytics_updated", { pollId, analytics });
  ioInstance
    .to(roomName(pollId))
    .emit("leaderboard_updated", { pollId, leaderboard });
}
