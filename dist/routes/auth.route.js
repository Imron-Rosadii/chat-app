"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware"); // middleware untuk validasi JWT
const router = (0, express_1.Router)();
// Register new user
router.post("/register", auth_controller_1.register);
// Login user
router.post("/login", auth_controller_1.login);
// Refresh token
router.post("/refresh", auth_controller_1.refresh);
// Logout user (protected route)
router.post("/logout", auth_middleware_1.protect, auth_controller_1.logout);
exports.default = router;
