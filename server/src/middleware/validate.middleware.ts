import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodEffects } from "zod";

export function validate(schema: AnyZodObject | ZodEffects<AnyZodObject>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(result.error);
    }

    const parsed = result.data;
    req.body = parsed.body ?? req.body;
    req.params = parsed.params ?? req.params;
    req.query = parsed.query ?? req.query;

    next();
  };
}