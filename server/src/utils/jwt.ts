import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(payload: string | Buffer | object): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.expiry as SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): string | JwtPayload {
  return jwt.verify(token, env.jwtSecret);
}