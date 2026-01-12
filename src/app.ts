import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { errorHandler } from "./middleware/error.Handler";
import { httpLogger } from "./middleware/logger";
import { NotFoundError } from "./exceptions/httpError";
import { requestId } from "./middleware/requestId";

const app = express();

// Global Middlewares

app.use(helmet());
app.use(cors());
app.use(requestId);
app.use(httpLogger);
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Chat API is running!",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// 🚨 404 ROUTE NOT FOUND (WAJIB DI SINI)
app.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

// 🌍 Global Error Handler (HARUS PALING BAWAH)
app.use(errorHandler);

export default app;
