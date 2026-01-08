"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
// src/services/auth.service.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const token_service_1 = require("./token.service");
const httpError_1 = require("../exceptions/httpError");
/**
 * Register user
 */
const register = async (username, email, password) => {
    // Check if user exists
    const exists = await prisma_1.default.user.findFirst({
        where: { OR: [{ email }, { username }] },
    });
    if (exists)
        throw new httpError_1.ConflictError("User already exists");
    const passwordHash = bcryptjs_1.default.hashSync(password, 10);
    const role = await prisma_1.default.role.findUnique({
        where: { name: "user" },
    });
    if (!role)
        throw new Error("Role 'user' not found");
    const user = await prisma_1.default.user.create({
        data: {
            username,
            email,
            passwordHash,
            roles: {
                create: {
                    roleId: role.id,
                },
            },
        },
        include: {
            roles: { include: { role: true } },
        },
    });
    const payload = {
        sub: user.id.toString(),
        userId: user.id.toString(),
        username: user.username,
        role: user.roles[0].role.name,
    };
    const tokens = token_service_1.TokenService.generateTokenPair(payload);
    await prisma_1.default.refreshToken.create({
        data: {
            token: tokens.refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return tokens;
};
exports.register = register;
/**
 * Login user
 */
const login = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
        include: { roles: { include: { role: true } } },
    });
    if (!user || !bcryptjs_1.default.compareSync(password, user.passwordHash)) {
        throw new httpError_1.UnauthorizedError("Invalid email or password");
    }
    const payload = {
        sub: user.id.toString(),
        userId: user.id.toString(),
        username: user.username,
        role: user.roles[0].role.name,
    };
    const tokens = token_service_1.TokenService.generateTokenPair(payload);
    await prisma_1.default.refreshToken.create({
        data: {
            token: tokens.refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return tokens;
};
exports.login = login;
/**
 * Refresh token
 */
const refresh = async (refreshToken) => {
    const decoded = token_service_1.TokenService.verifyRefreshToken(refreshToken);
    const storedToken = await prisma_1.default.refreshToken.findFirst({
        where: { token: refreshToken, userId: BigInt(decoded.sub) },
        include: {
            user: { include: { roles: { include: { role: true } } } },
        },
    });
    if (!storedToken)
        throw new httpError_1.UnauthorizedError("Invalid refresh token");
    const user = storedToken.user;
    const payload = {
        sub: user.id.toString(),
        userId: user.id.toString(),
        username: user.username,
        role: user.roles[0].role.name,
    };
    const newTokens = token_service_1.TokenService.generateTokenPair(payload);
    // Delete old token & create new
    await prisma_1.default.refreshToken.delete({ where: { id: storedToken.id } });
    await prisma_1.default.refreshToken.create({
        data: {
            token: newTokens.refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    return newTokens;
};
exports.refresh = refresh;
/**
 * Logout user
 */
const logout = async (userId) => {
    await prisma_1.default.refreshToken.deleteMany({
        where: { userId: BigInt(userId) },
    });
};
exports.logout = logout;
