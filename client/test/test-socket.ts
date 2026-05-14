import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected");
  console.log("Socket ID:", socket.id);

  socket.emit(
    "poll:join",

    {
      pollId: "abc123456789",
    },

    (response: any) => {
      console.log("ACK:", response);
    }
  );
});

socket.onAny((event, data) => {
  console.log("\n📩 EVENT RECEIVED");
  console.log("Event:", event);
  console.log("Data:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});