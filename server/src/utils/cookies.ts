import { Response } from "express";
import { isProduction, env } from "../config/env.js";

export function setAuthCookie(res: Response, token: string): void {

  const isLocal = env.clientUrl.includes("localhost");

  res.cookie("pulseboard_token", token, {
    httpOnly: true,
    secure: isProduction && !isLocal,
    sameSite: isProduction && !isLocal ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie("pulseboard_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
}
