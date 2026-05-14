import { clearAuthCookie, setAuthCookie } from "../../utils/cookies.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success, error } from "../../utils/apiResponse.js";
import { loginUser, registerUser, serializeUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  setAuthCookie(res, result.token);
  success(201, "Registration successful", { user: result.user });
  // res.status(201).json({ user: result.user });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);
  success(200, "Login successful", { user: result.user });
  // res.json({ user: result.user });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  success(200, "Logout successful", { message: "Logged out" });
  // res.json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  success(200, "/me", { user: serializeUser(req.user) });
  // res.json({ user: serializeUser(req.user) });
});
