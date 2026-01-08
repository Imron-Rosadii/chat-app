import { Request } from "express";

export interface JWTPayload {
  sub: string; // userId (string, sesuai JWT spec)
  userId: string;
  username: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
