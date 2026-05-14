import { createClient } from "./utils.js";

const socket = createClient("LEADERBOARD_CLIENT");

socket.on("connect", () => {

  setTimeout(() => {

    socket.emit(
      "leaderboard:request",

      {
        pollId: "abc123",
      },

      (ack: any) => {
        console.log("\n🏆 LEADERBOARD ACK");
        console.log(ack);
      }
    );

  }, 1000);
});