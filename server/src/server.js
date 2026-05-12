import http from "http";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { initSockets } from "./sockets/poll.socket.js";

const app = createApp();
const server = http.createServer(app);

initSockets(server);

connectDb()
  .then(() => {
    server.listen(env.port, () => {
      console.log(`PulseBoard API listening on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
