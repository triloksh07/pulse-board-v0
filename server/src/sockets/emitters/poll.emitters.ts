import { Server } from "socket.io";

import { SOCKET_EVENTS } from "../events";
import { rooms } from "../rooms";

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

export const emitResponseCountUpdated = (
  io: Server,
  pollId: string,
  totalResponses: number
) => {
  io.to(rooms.poll(pollId)).emit(
    SOCKET_EVENTS.RESPONSE_COUNT_UPDATED,
    {
      pollId,
      totalResponses,
    }
  );
};