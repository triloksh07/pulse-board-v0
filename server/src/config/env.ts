import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  // mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pulseboard",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/pulseboard",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
  expiry: process.env.JWT_EXPIRES_IN || "1d",
};

export const isProduction = env.nodeEnv === "production";
