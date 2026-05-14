import { io, Socket } from "socket.io-client";

export const createClient = (
  label: string,
  pollId = "abc123",
  token?: string
): Socket => {

  const socket = io("http://localhost:5000", {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log(`\n✅ ${label} connected`);
    console.log(`${label} socket: ${socket.id}`);

    socket.emit(
      "poll:join",

      { pollId },

      (ack: any) => {
        console.log(`${label} ACK:`, ack);
      }
    );
  });

  socket.onAny((event, data) => {
    console.log(`\n📩 ${label} received`);
    console.log("EVENT:", event);
    console.log("DATA:", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${label} disconnected`);
  });

  return socket;
};