import dotenv from "dotenv";
dotenv.config(); // 🔹 HARUS DI PERTAMA

import http from "http";
import app from "./app";
import config from "./config";
import logger from "./utils/logger";
import prisma from "./utils/prisma"; // import default dari prisma.ts
import { initSocket } from "./socket/index";
import "./utils/cloudinary";

// ========================
// Seed default 'user' role
// ========================
async function seedDefaultRole() {
  try {
    const existingRole = await prisma.role.findUnique({
      where: { name: "user" },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: { name: "user" }, // description memang tidak ada
      });
      logger.info("Default 'user' role created.");
    } else {
      logger.info("Default 'user' role already exists.");
    }
  } catch (err) {
    logger.error("Error seeding default role:", err);
    throw err;
  }
}

// ========================
// Start server
// ========================
const server = http.createServer(app);

// init websocket
initSocket(server);

async function startServer() {
  try {
    await seedDefaultRole();

    server.listen(config.port, () => {
      logger.info(
        `🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// ========================
// Global error handlers
// ========================
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at: %o, reason: %s", promise, reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception: %o", error);
  process.exit(1);
});

startServer();
