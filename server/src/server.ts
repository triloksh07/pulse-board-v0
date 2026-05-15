import http from "http";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { initSockets } from "./sockets/index.js";

const app = createApp();
const server = http.createServer(app);

const io = initSockets(server);
app.set("io", io);

const startServer = async () => {
  try {
    await connectDb();
    server.listen(env.port, () => {
      console.log(`\n🚀 PulseBoard Server running on port ${env.port}`);
      console.log(`📡 Socket.IO ready for realtime connections\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { io };
