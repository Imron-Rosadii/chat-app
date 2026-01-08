"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const appError_1 = require("./appError");
class BadRequestError extends appError_1.AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends appError_1.AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends appError_1.AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends appError_1.AppError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends appError_1.AppError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
