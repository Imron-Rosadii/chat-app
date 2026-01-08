// src/routes/auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware"; // middleware untuk validasi JWT
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator";
import { validateRequest } from "../middleware/validate.request";

const router = Router();

// Register new user
router.post("/register", registerValidator, validateRequest, register);

// Login user
router.post("/login", loginValidator, login);

// Refresh token
router.post("/refresh", refresh);

// Logout user (protected route)
router.post("/logout", protect, logout);

export default router;
