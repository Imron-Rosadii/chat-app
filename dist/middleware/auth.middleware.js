"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const token_service_1 = require("../services/token.service");
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = token_service_1.TokenService.verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.protect = protect;
