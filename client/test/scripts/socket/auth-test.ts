import { createClient } from "./utils.js";

const socket = createClient(
  "AUTH_CLIENT",
  "abc123"
);

socket.on("connect", () => {

  socket.emit(
    "response:submit",

    {
      pollId: "abc123",
      answers: [],
    },

    (ack: any) => {
      console.log("\n🔐 AUTH ACK");
      console.log(ack);
    }
  );
});