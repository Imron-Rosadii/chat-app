import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../exceptions/appError";
import logger from "../utils/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error (full stack)
  logger.error(err);

  /**
   * Prisma known errors
   */
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Duplicate field value entered",
      });
    }
  }

  /**
   * Operational / expected error
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  /**
   * Unknown / programming error
   */
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
