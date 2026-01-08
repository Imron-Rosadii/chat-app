"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const auth_service_1 = require("../services/auth.service");
/**
 * Register controller
 */
exports.register = (0, asyncHandler_1.default)(async (req, res) => {
    const { username, email, password } = req.body;
    const result = await (0, auth_service_1.register)(username, email, password);
    res.status(201).json({
        success: true,
        data: result,
    });
});
/**
 * Login controller
 */
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const result = await (0, auth_service_1.login)(email, password);
    res.status(200).json({
        success: true,
        data: result,
    });
});
/**
 * Refresh token controller
 */
exports.refresh = (0, asyncHandler_1.default)(async (req, res) => {
    const { refreshToken: token } = req.body;
    const result = await (0, auth_service_1.refresh)(token);
    res.status(200).json({
        success: true,
        data: result,
    });
});
/**
 * Logout controller
 */
exports.logout = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.user?.sub; // pastikan middleware auth menambahkan user ke req
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    await (0, auth_service_1.logout)(userId);
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});
