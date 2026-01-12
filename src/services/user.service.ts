import prisma from "../utils/prisma";
import { NotFoundError, BadRequestError } from "../exceptions/httpError";
import { Prisma, UserStatus, UserPresence } from "@prisma/client";

export type PrivateUserProfile = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  status: UserStatus;
  presence: UserPresence;
  roles: { name: string; description: string | null }[];
  createdAt: Date;
  updatedAt: Date;
};

// =====================
// GET ALL USERS (ADMIN)
// =====================
export async function getAllUsers(query: {
  search?: string;
  status?: UserStatus;
  page: number;
  limit: number;
}): Promise<{ users: PrivateUserProfile[]; total: number }> {
  const { search, status, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};
  const andConditions: Prisma.UserWhereInput[] = [];

  if (status) {
    andConditions.push({ status });
  }

  if (search) {
    andConditions.push({
      username: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // ❗ NEON-SAFE (NO TRANSACTION)
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        status: true,
        presence: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.user.count({ where }),
  ]);

  return {
    total,
    users: users.map((u) => ({
      id: u.id.toString(),
      username: u.username,
      email: u.email,
      avatarUrl: u.avatarUrl,
      status: u.status,
      bio: u.bio,
      presence: u.presence,
      roles: u.roles.map((r) => r.role),
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })),
  };
}

// =====================
// GET ALL USERS (PUBLIC)
// =====================
export async function getAllPublicUsers(query: {
  search?: string;
  page: number;
  limit: number;
}) {
  const { search, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.username = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        status: true,
        bio: true,
        presence: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    total,
    users: users.map((u) => ({
      id: u.id.toString(),
      username: u.username,
      avatarUrl: u.avatarUrl,
      status: u.status,
      bio: u.bio,
      presence: u.presence,
    })),
  };
}

// =====================
// GET USER BY ID
// (ADMIN / PUBLIC PROFILE)
// =====================
export async function getUserById(userId: string): Promise<PrivateUserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      bio: true,
      status: true,
      presence: true,
      roles: {
        select: {
          role: {
            select: {
              name: true,
              description: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return {
    id: user.id.toString(),
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    status: user.status,
    presence: user.presence,
    roles: user.roles.map((r) => r.role),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

import bcrypt from "bcryptjs";

// =====================
// UPDATE PASSWORD (USER)
// =====================
export async function updateUserPassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
    },
  });

  return { message: "Password updated successfully" };
}

// =====================
// UPDATE EMAIL (USER)
// =====================
export async function updateUserEmail(userId: string, newEmail: string) {
  // cek email sudah dipakai atau belum
  const existing = await prisma.user.findUnique({
    where: { email: newEmail },
    select: { id: true },
  });

  if (existing) {
    throw new Error("Email already in use");
  }

  const user = await prisma.user.update({
    where: { id: BigInt(userId) },
    data: {
      email: newEmail,
    },
    select: {
      id: true,
      email: true,
      updatedAt: true,
    },
  });

  return {
    id: user.id.toString(),
    email: user.email,
    updatedAt: user.updatedAt,
  };
}

// =====================
// UPDATE USER ROLE (ADMIN)
// =====================
export async function updateUserRole(userId: string, roleId: number) {
  // pastikan user ada
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // hapus role lama
  await prisma.userRole.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // assign role baru
  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId,
    },
  });

  return { message: "User role updated successfully" };
}

// =====================
// UPDATE USER STATUS (ADMIN)
// =====================
export async function updateUserStatus(userId: string, status: UserStatus) {
  if (!status) {
    throw new BadRequestError("status is required");
  }

  // validasi enum manual (extra safety)
  if (!Object.values(UserStatus).includes(status)) {
    throw new BadRequestError("Invalid user status");
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      status,
    },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });

  return {
    id: updated.id.toString(),
    status: updated.status,
    updatedAt: updated.updatedAt,
  };
}

import cloudinary from "../utils/cloudinary";

export async function updateUserAvatar(
  userId: string,
  file: Express.Multer.File
) {
  if (!file) {
    throw new Error("Avatar file is required");
  }

  const upload = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "chat-app",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as any);
          }
        )
        .end(file.buffer);
    }
  );

  const user = await prisma.user.update({
    where: { id: BigInt(userId) },
    data: {
      avatarUrl: upload.secure_url,
    },
    select: {
      id: true,
      avatarUrl: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return {
    id: user.id.toString(),
    avatarUrl: user.avatarUrl,
  };
}
