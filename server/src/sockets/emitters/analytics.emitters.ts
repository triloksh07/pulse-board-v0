import { Server } from "socket.io";

import { SOCKET_EVENTS } from "../events.js";
import { rooms } from "../rooms.js";

export const emitAnalyticsUpdated = (
  io: Server,
  pollId: string,
  analytics: unknown
) => {
  io.to(rooms.poll(pollId)).emit(
    SOCKET_EVENTS.ANALYTICS_UPDATED,
    {
      pollId,
      analytics,
    }
  );
};

export const emitLeaderboardUpdated = (
  io: Server,
  pollId: string,
  leaderboard: unknown[]
) => {
  io.to(rooms.poll(pollId)).emit(
    SOCKET_EVENTS.LEADERBOARD_UPDATED,
    {
      pollId,
      leaderboard,
    }
  );
};