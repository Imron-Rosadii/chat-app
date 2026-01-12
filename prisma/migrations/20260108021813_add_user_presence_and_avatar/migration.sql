-- CreateEnum
CREATE TYPE "UserPresence" AS ENUM ('ONLINE', 'AWAY', 'BUSY', 'OFFLINE');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "presence" "UserPresence" NOT NULL DEFAULT 'OFFLINE';
