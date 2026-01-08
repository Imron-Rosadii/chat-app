// src/middleware/requestId.ts
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const requestId = (
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction
) => {
  req.requestId = crypto.randomBytes(4).toString("hex");
  res.setHeader("X-Request-Id", req.requestId);
  next();
};
