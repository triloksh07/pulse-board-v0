import { Socket } from "socket.io";
import { SOCKET_EVENTS } from "../events.js";
import { ackError, ackSuccess } from "../utils/ack.js";
import { getLeaderboardForPoll } from "../../modules/leaderboard/leaderboard.service.js";
import type { LeaderboardRequestPayload } from "../types.js";

export const registerLeaderboardHandlers = (socket: Socket) => {
  socket.on(
    SOCKET_EVENTS.LEADERBOARD_REQUEST,

    async (payload: LeaderboardRequestPayload, cb) => {
      try {
        if (!payload?.pollId) {
          return ackError(cb, "Poll ID required");
        }

        const leaderboard = await getLeaderboardForPoll(payload.pollId);

        socket.emit(SOCKET_EVENTS.LEADERBOARD_UPDATED, {
          pollId: payload.pollId,
          leaderboard,
        });

        ackSuccess(cb);
      } catch (err) {
        console.error(err);

        ackError(cb, "Failed to fetch leaderboard");
      }
    }
  );
};
