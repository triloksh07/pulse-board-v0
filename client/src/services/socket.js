import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      withCredentials: true,
      autoConnect: true,
    });

    socket.on("error", (err) => {
      console.error("Socket Error:", err.message);
    });
  }

  return socket;
}
