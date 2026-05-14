import { createClient } from "./utils.js";

const socket = createClient("SPAMMER");

socket.on("connect", () => {

  let count = 0;

  const interval = setInterval(() => {

    count++;

    socket.emit(
      "poll:join",

      {
        pollId: "abc123",
      },

      (ack: any) => {
        console.log(`SPAM ${count}`, ack);
      }
    );

    if (count >= 100) {
      clearInterval(interval);

      console.log("\n✅ Spam test complete");
    }

  }, 50);
});