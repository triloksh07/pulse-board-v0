import { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "../events.js";
import { rooms } from "../rooms.js";

import { ackError, ackSuccess } from "../utils/ack.js";

import type { JoinPollPayload, LeavePollPayload } from "../types.js";

export const registerPollHandlers = (io: Server, socket: Socket) => {
  socket.on(
    SOCKET_EVENTS.POLL_JOIN,

    async (payload: JoinPollPayload, cb) => {
      try {
        if (!payload?.pollId) {
          return ackError(cb, "Poll ID required");
        }

        const room = rooms.poll(payload.pollId);

        socket.join(room);

        // io.to(room).emit(
        //   "analytics:updated",
        //   {
        //     pollId: payload.pollId,
        //     test: true,
        //   }
        // );

        // socket.to(room).emit(
        //   "analytics:updated",
        //   {
        //     pollId: "abc123456789",
        //     test: true,
        //   }
        // );

        console.log(`Socket ${socket.id} joined ${room}`);

        ackSuccess(cb, {
          joined: true,
        });
      } catch (err) {
        console.error(err);

        ackError(cb, "Failed to join poll");
      }
    }
  );

  socket.on(
    SOCKET_EVENTS.POLL_LEAVE,

    async (payload: LeavePollPayload, cb) => {
      try {
        if (!payload?.pollId) {
          return ackError(cb, "Poll ID required");
        }

        const room = rooms.poll(payload.pollId);

        socket.leave(room);

        console.log(`Socket ${socket.id} left ${room}`);

        ackSuccess(cb, {
          left: true,
        });
      } catch (err) {
        console.error(err);

        ackError(cb, "Failed to leave poll");
      }
    }
  );
};
