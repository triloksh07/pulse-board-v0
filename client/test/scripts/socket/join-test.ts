import { createClient } from "./utils.js";

createClient("CLIENT_A");
createClient("CLIENT_B");
createClient("CLIENT_C");

/**
 * RUN: npx tsx test/scripts/socket/join-test.ts
 */