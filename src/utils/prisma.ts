import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL tidak ditemukan di variabel lingkungan. Pastikan file .env sudah benar."
  );
}

// 1. Buat instance dari adapter
const adapter = new PrismaPg({ connectionString });

// 2. Buat PrismaClient dengan adapter
const prisma = new PrismaClient({ adapter });

// 3. Cek koneksi ke database
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1); // Stop app jika DB gagal connect
  }
})();

export default prisma;
