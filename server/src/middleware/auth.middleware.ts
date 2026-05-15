import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/auth/user.model.js";
import { HttpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/jwt.js";

// Extending the Express Request to include custom user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bearer = req.headers.authorization;

    const token =
      req.cookies?.pulseboard_token ||
      (bearer?.startsWith("Bearer ") ? bearer.split(" ")[1] : null);

    if (!token) {
      throw new HttpError(401, "Authentication required");
    }

    const payload = verifyToken(token) as JwtPayload;
    const user = await User.findById(payload.sub).select("-password");

    if (!user) {
      throw new HttpError(401, "Authentication required");
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(
      error.statusCode ? error : new HttpError(401, "Authentication required")
    );
  }
}

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.pulseboard_token;

    if (!token) {
      return next();
    }

    const payload = verifyToken(token) as JwtPayload;
    req.user = await User.findById(payload.sub).select("-password");
    return next();
  } catch {
    return next();
  }
}
