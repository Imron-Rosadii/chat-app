import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware untuk mengecek hasil validasi dan extra fields
const validate = (allowedFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Cek extra fields
    const extraFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key)
    );
    if (extraFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Unexpected fields: ${extraFields.join(", ")}`,
      });
    }

    // Cek validasi express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    next();
  };
};

// Register Validator
export const registerValidator = [
  body("username").notEmpty().withMessage("Username is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  // Middleware untuk cek extra fields dan error
  validate(["username", "email", "password", "confirmPassword"]),
];

// Login Validator
export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  // Middleware untuk cek extra fields dan error
  validate(["email", "password"]),
];
