// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/token.service";
import { JWTPayload } from "../types/auth.type";

// Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayload;
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = TokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
