import { Server } from "socket.io";

import { SOCKET_EVENTS } from "../events.js";
import { rooms } from "../rooms.js";

export const emitPollPublished = (
  io: Server,
  pollId: string,
  payload?: unknown
) => {
  io.to(rooms.poll(pollId)).emit(
    SOCKET_EVENTS.POLL_PUBLISHED,
    payload ?? { pollId }
  );
};

export const emitPollExpired = (
  io: Server,
  pollId: string,
  payload?: unknown
) => {
  io.to(rooms.poll(pollId)).emit(
    SOCKET_EVENTS.POLL_EXPIRED,
    payload ?? { pollId }
  );
};

export const emitResponseCountUpdated = async (
  io: Server,
  pollId: string,
  totalResponses: number
) => {
  io.to(rooms.poll(pollId)).emit(SOCKET_EVENTS.RESPONSE_COUNT_UPDATED, {
    pollId,
    totalResponses,
  });
};
