import { Request, Response, NextFunction } from "express";
import Joi from "joi";

type Target = "body" | "query" | "params";

export function validate(schema: Joi.ObjectSchema, target: Target = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((d) => d.message.replace(/['"]/g, ""));
      res.status(400).json({
        code: 0,
        status: "FAIL",
        message: "Validation failed",
        errors,
      });
      return;
    }

    req[target] = value;
    next();
  };
}
