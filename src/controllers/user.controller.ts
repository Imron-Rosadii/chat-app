import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { UserStatus } from "@prisma/client";

// =====================
// GET ALL USERS (ADMIN)
// =====================
export async function getAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await userService.getAllUsers({
      search: req.query.search as string | undefined,
      status: req.query.status as any,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.users,
      meta: {
        page,
        limit,
        total: result.total,
      },
    });
  } catch (err) {
    next(err);
  }
}

// =====================
// GET ALL USERS (PUBLIC)
// =====================
export async function getAllPublicUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await userService.getAllPublicUsers({
      search: req.query.search as string | undefined,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.users,
      meta: {
        page,
        limit,
        total: result.total,
      },
    });
  } catch (err) {
    next(err);
  }
}

// =====================
// GET USER BY ID
// (PUBLIC / AUTH USER)
// =====================
export async function getUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.getUserById(req.params.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

// =====================
// UPDATE PASSWORD (USER)
// =====================
export async function updateUserPasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.sub;
    const { oldPassword, newPassword } = req.body;

    const result = await userService.updateUserPassword(
      userId,
      oldPassword,
      newPassword
    );

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

// =====================
// UPDATE EMAIL (USER)
// =====================
export async function updateUserEmailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.sub;
    const { email } = req.body;

    const result = await userService.updateUserEmail(userId, email);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

// =====================
// UPDATE USER ROLE (ADMIN)
// =====================
export async function updateUserRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    const result = await userService.updateUserRole(userId, roleId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

// =====================
// UPDATE USER STATUS (ADMIN)
// =====================
export async function updateUserStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const { status } = req.body as { status: UserStatus };

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    const result = await userService.updateUserStatus(userId, status);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAvatar(req: Request, res: Response) {
  const userId = req.user!.sub; // dari JWT middleware
  const file = req.file;

  const result = await userService.updateUserAvatar(userId, file!);

  res.json({
    success: true,
    message: "Profile picture updated",
    data: result,
  });
}
