import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  next({ statusCode: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.flatten(),
    });
  }

  const statusCode: number = err.statusCode || 500;
  const payload: Record<string, any> = {
    message: err.message || "Internal server error",
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}