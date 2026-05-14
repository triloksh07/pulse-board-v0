import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.onAny((event, data) => {
  console.log(event, data);
});

socket.emit(
  "poll:join",
  { pollId: "123" },

  (response) => {
    console.log(response);
  }
);