"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        // ✅ HARDCODE + TYPE SAFE
        accessExpiresIn: "15m",
        refreshExpiresIn: "7d",
    },
};
// Fail fast
if (!config.databaseUrl) {
    throw new Error("Missing DATABASE_URL");
}
if (!config.jwt.accessSecret || !config.jwt.refreshSecret) {
    throw new Error("Missing JWT secrets");
}
exports.default = config;
