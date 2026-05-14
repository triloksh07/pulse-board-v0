// import type { Response, CookieOptions } from "express";
import { isProduction } from "../config/env.js";

export function setAuthCookie(res, token) {
  res.cookie("pulseboard_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie("pulseboard_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
  });
}
