import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginUser, registerUser, serializeUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  setAuthCookie(res, result.token);
  res.status(201).json({ user: result.user });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);
  res.json({ user: result.user });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});
