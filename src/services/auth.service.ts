// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma";
import { TokenService } from "./token.service";
import { ConflictError, UnauthorizedError } from "../exceptions/httpError";
import { TokenPair } from "../types/auth.type";
import logger from "../utils/logger";

/**
 * Register user
 */

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<void> => {
  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (exists) {
    logger.warn("Register failed: user already exists", {
      email,
      username,
    });
    throw new ConflictError("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const role = await prisma.role.findUnique({
    where: { name: "user" },
  });

  if (!role) {
    logger.error("Register failed: default role not found", {
      email,
      username,
    });
    throw new Error("Role 'user' not found");
  }

  await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      roles: {
        create: { roleId: role.id },
      },
    },
  });

  logger.info("User registered successfully", { email, username });
};

/**
 * Login user
 */
export const login = async (
  email: string,
  password: string
): Promise<TokenPair> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });

  if (!user) {
    logger.warn("Login failed: user not found", { email });
    throw new UnauthorizedError("Invalid email ");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    logger.warn("Login failed: wrong password", {
      email,
      userId: user.id,
    });
    throw new UnauthorizedError("Invalid password");
  }

  const payload = {
    sub: user.id.toString(),
    userId: user.id.toString(),
    username: user.username,
    roles: user.roles.map((r) => r.role.name), // ✅ ARRAY
  };

  const tokens = TokenService.generateTokenPair(payload);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  logger.info("Login successful", {
    userId: user.id,
    email,
  });

  return tokens;
};

/**
 * Refresh token
 */
export const refresh = async (refreshToken: string): Promise<TokenPair> => {
  const decoded = TokenService.verifyRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findFirst({
    where: { token: refreshToken, userId: BigInt(decoded.sub) },
    include: {
      user: { include: { roles: { include: { role: true } } } },
    },
  });

  if (!storedToken) throw new UnauthorizedError("Invalid refresh token");

  const user = storedToken.user;

  const payload = {
    sub: user.id.toString(),
    userId: user.id.toString(),
    username: user.username,
    roles: user.roles.map((r) => r.role.name), // ✅ ARRAY
  };

  const newTokens = TokenService.generateTokenPair(payload);

  // Delete old token & create new
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });
  await prisma.refreshToken.create({
    data: {
      token: newTokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return newTokens;
};

/**
 * Logout user
 */
// auth.service.ts
export const logout = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId: BigInt(userId) },
  });
};
