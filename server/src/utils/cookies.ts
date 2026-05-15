import { Response } from "express";
import { isProduction } from "../config/env.js";

export function setAuthCookie(res: Response, token: string): void {
  res.cookie("pulseboard_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie("pulseboard_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
  });
}