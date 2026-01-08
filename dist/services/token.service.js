"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
// src/services/token.service.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class TokenService {
    static generateTokenPair(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt.accessSecret, {
            expiresIn: config_1.default.jwt.accessExpiresIn,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt.refreshSecret, {
            expiresIn: config_1.default.jwt.refreshExpiresIn,
        });
        return { accessToken, refreshToken };
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.accessSecret);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.refreshSecret);
    }
}
exports.TokenService = TokenService;
