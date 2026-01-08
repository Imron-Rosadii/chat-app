"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const appError_1 = require("../exceptions/appError");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    // Log error (full stack)
    logger_1.default.error(err);
    /**
     * Prisma known errors
     */
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
    if (err instanceof appError_1.AppError) {
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
exports.errorHandler = errorHandler;
