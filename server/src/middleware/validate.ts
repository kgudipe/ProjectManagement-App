import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

interface RequestSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Validates and coerces request input against Zod schemas. Parsed values replace
 * the raw input so downstream handlers receive typed, sanitised data. Validation
 * errors are forwarded to the central error handler as a 400.
 *
 * Note: in Express 5 `req.query` is read-only, so we mutate its properties in place
 * rather than reassigning the object.
 */
export const validate =
  (schemas: RequestSchemas) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        Object.assign(req.params, schemas.params.parse(req.params));
      }
      if (schemas.query) {
        const parsed = schemas.query.parse(req.query) as Record<string, unknown>;
        for (const [key, value] of Object.entries(parsed)) {
          (req.query as Record<string, unknown>)[key] = value;
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
