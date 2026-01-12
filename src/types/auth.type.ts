import { Request } from "express";

export interface JWTPayload {
  sub: string;
  userId: string;
  username: string;
  roles: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
