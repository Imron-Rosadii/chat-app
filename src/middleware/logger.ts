import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import crypto from "crypto";

export const httpLogger = (
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime.bigint();

  // attach requestId
  req.requestId = crypto.randomBytes(4).toString("hex");

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    logger.info("HTTP_REQUEST", {
      framework: "Express",
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
      userAgent: req.headers["user-agent"],
    });
  });

  next();
};
