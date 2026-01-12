// validators/user.validator.ts
import { z } from "zod";
import { UserPresence, UserStatus } from "@prisma/client";

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  avatarUrl: z.string().url().optional(),
});

export const updatePresenceSchema = z.object({
  presence: z.nativeEnum(UserPresence),
});

export const adminUpdateStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});
