// src/services/token.service.ts
import jwt from "jsonwebtoken";
import config from "../config";
import { JWTPayload, TokenPair } from "../types/auth.type";

export class TokenService {
  static generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwt.accessSecret) as JWTPayload;
  }

  static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
  }
}
