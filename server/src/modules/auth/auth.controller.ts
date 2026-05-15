import { Request, Response } from "express";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success, error } from "../../utils/apiResponse.js";
import { loginUser, registerUser, serializeUser } from "./auth.service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  setAuthCookie(res, result.token);
  success(res, 201, "Registration successful", { user: result.user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);
  success(res, 200, "Login successful", {
    user: result.user,
    // token: result.token,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  clearAuthCookie(res);
  success(res, 200, "Logout successful", { message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  success(res, 200, "/me", { user: serializeUser(req.user) });
});
