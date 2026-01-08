// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  register as registerUser,
  login as loginUser,
  refresh as refreshToken,
  logout as logoutUser,
} from "../services/auth.service";

/**
 * Register controller
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  await registerUser(username, email, password);

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please login.",
  });
});

/**
 * Login controller
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await loginUser(email, password);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Refresh token controller
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  const result = await refreshToken(token);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Logout controller
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.sub; // pastikan middleware auth menambahkan user ke req

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  await logoutUser(userId);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
