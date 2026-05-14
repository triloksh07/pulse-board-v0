import { Server, Socket } from "socket.io";
import { env } from "../config/env";
import { registerPollHandlers } from "./handlers/poll.handlers";
import { registerLeaderboardHandlers } from "./handlers/leaderboard.handlers";

export const initSockets = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    registerPollHandlers(io, socket);

    registerLeaderboardHandlers(socket);

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

