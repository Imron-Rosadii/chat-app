import { Router } from "express";
import {
  getAllPublicUsersController,
  getAllUsersController,
  getUserByIdController,
  updateAvatar,
  updateUserEmailController,
  updateUserPasswordController,
  updateUserRoleController,
  updateUserStatusController,
} from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { uploadAvatar } from "../middleware/upload";

const router = Router();

// =====================
// ADMIN ONLY
// =====================
router.get("/", protect, requireRole("admin"), getAllUsersController);

// =====================
// USER PROFILE
// =====================
router.get("/:id", protect, getUserByIdController);

router.get("/", getAllPublicUsersController);
router.get("/:id", getUserByIdController);

router.put("/me/password", protect, updateUserPasswordController);
router.put("/me/email", protect, updateUserEmailController);

router.put("/me/avatar", protect, uploadAvatar.single("avatar"), updateAvatar);

router.put(
  "/:userId/role",
  protect,
  requireRole("admin"),
  updateUserRoleController
);

router.put(
  "/:userId/status",
  protect,
  requireRole("admin"),
  updateUserStatusController
);

export default router;
