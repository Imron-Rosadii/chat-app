import dotenv from "dotenv";
import path from "path";
import { SignOptions } from "jsonwebtoken";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: SignOptions["expiresIn"];
    refreshExpiresIn: SignOptions["expiresIn"];
  };
}

const config: Config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL!,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,

    // ✅ HARDCODE + TYPE SAFE
    accessExpiresIn: "15m",
    refreshExpiresIn: "7d",
  },
};

// Fail fast
if (!config.databaseUrl) {
  throw new Error("Missing DATABASE_URL");
}

if (!config.jwt.accessSecret || !config.jwt.refreshSecret) {
  throw new Error("Missing JWT secrets");
}

export default config;
