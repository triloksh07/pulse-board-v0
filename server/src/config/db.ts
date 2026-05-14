import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDb = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(env.mongoUri as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`, error);
    process.exit(1);
  }
};
