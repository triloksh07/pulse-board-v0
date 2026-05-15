// test-flow.ts
import { io } from "socket.io-client";

const TOKEN = "token";
const POLL_ID = "poll_id";

// Connect to the server
const socket = io("http://localhost:5000", {
  auth: { token: TOKEN } 
});

socket.on("connect", () => {
  console.log(`✅ Connected with Socket ID: ${socket.id}`);

  // Test joining the poll room
  socket.emit("poll:join", { pollId: POLL_ID }, (response: any) => {
    console.log("📥 Join Poll Response:", response);
  });
});

// Listen for the emitters you migrated
socket.on("poll:published", (data) => {
  console.log("📢 Event Received: poll_published", data);
});

socket.on("response:countUpdated", (data) => {
  console.log("📊 Event Received: response_count_updated", data);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
});

/**
 * USAGE: npx tsx test-flow.ts
 */
