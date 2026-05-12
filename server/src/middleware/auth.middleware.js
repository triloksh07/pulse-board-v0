import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../modules/auth/user.model.js";
import { HttpError } from "../utils/httpError.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.pulseboard_token;

    if (!token) {
      throw new HttpError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      throw new HttpError(401, "Authentication required");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError(401, "Authentication required"));
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.pulseboard_token;

    if (!token) {
      return next();
    }

    const payload = jwt.verify(token, env.jwtSecret);
    req.user = await User.findById(payload.sub).select("-password");
    return next();
  } catch {
    return next();
  }
}
