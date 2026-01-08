import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import logger from "../utils/logger";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const safeErrors = errors.array().map((err: ValidationError) => ({
      field: "path" in err ? err.path : "unknown",
      message: err.msg,
    }));

    logger.warn("Request validation failed", {
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      errors: safeErrors,
    });

    return res.status(422).json({
      success: false,
      errors: safeErrors,
    });
  }

  next();
};
