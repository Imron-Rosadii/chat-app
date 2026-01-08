"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // 🔹 HARUS DI PERTAMA
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./utils/logger"));
const prisma_1 = __importDefault(require("./utils/prisma")); // PrismaClient sekarang bisa connect
async function seedDefaultRole() {
    const existingRole = await prisma_1.default.role.findUnique({
        where: { name: "user" },
    });
    if (!existingRole) {
        await prisma_1.default.role.create({
            data: { name: "user" }, // Prisma schema tidak ada description
        });
        logger_1.default.info("Default 'user' role created.");
    }
}
const server = http_1.default.createServer(app_1.default);
async function startServer() {
    try {
        await seedDefaultRole();
        server.listen(config_1.default.port, () => {
            logger_1.default.info(`🚀 Server running on port ${config_1.default.port} in ${config_1.default.nodeEnv} mode`);
        });
    }
    catch (error) {
        logger_1.default.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
