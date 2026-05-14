
import { ZodError } from "zod";

export function validate(schema) {
  return (req, res, next) => {
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
