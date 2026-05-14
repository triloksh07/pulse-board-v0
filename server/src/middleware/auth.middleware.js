import { User } from "../modules/auth/user.model.js";
import { HttpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/jwt";

export async function requireAuth(req, res, next) {
  try {
    const bearer = req.headers.authorization;

    const token =
      req.cookies?.pulseboard_token ||
      (bearer?.startsWith("Bearer ") ? bearer.split(" ")[1] : null);

    if (!token) {
      throw new HttpError(401, "Authentication required");
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      throw new HttpError(401, "Authentication required");
    }

    req.user = user;
    next();
  } catch (error) {
    next(
      error.statusCode ? error : new HttpError(401, "Authentication required")
    );
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.pulseboard_token;

    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    req.user = await User.findById(payload.sub).select("-password");
    return next();
  } catch {
    return next();
  }
}
