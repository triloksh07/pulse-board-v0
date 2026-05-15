import { z, ZodSchema } from "zod";

class BaseDto {
  static schema: ZodSchema = z.object({});

  static validate<T>(this: { schema: ZodSchema<T> }, data: unknown): { errors: string[] | null; value: T | null } {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map(e => e.message);
      return { errors, value: null };
    }

    return { errors: null, value: result.data };
  }
}

export default BaseDto;