import winston from "winston";
import fs from "fs";
import path from "path";

// Pastikan folder log ada saat aplikasi dimulai
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const isProduction = process.env.NODE_ENV === "production";

/**
 * =========================
 * JSON format (production & file)
 * =========================
 */
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * =========================
 * DEV console format (sederhana & satu baris)
 * =========================
 */
const devConsoleFormat = winston.format.printf((info) => {
  // Tidak perlu membuat colorizer manual di sini
  const {
    level, // Properti level akan diwarnai oleh format.colorize() sebelum sampai sini
    message,
    timestamp,
    requestId,
    method,
    path,
    statusCode,
    durationMs,
    userAgent,
  } = info;

  let logString = `[Express] [${level}] [${timestamp}]`; // Gunakan `level` langsung

  if (requestId) {
    logString += ` #${requestId}`;
  }

  if (method && path && statusCode !== undefined) {
    // Log HTTP request
    logString += ` ${method} ${path} → ${statusCode} (${durationMs}ms) ua=${userAgent}`;
  } else {
    // Log aplikasi biasa
    logString += ` ${message}`;
  }

  return logString;
});

// Kombinasi format untuk console di development
// Urutan itu penting!
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // 1. Warnai properti 'level' dari objek info
  winston.format.colorize({ level: true }),
  // 2. Lalu, format objek info yang sudah diwarnai menjadi string
  devConsoleFormat
);

/**
 * =========================
 * Transports
 * =========================
 */
const transports: winston.transport[] = [
  new winston.transports.Console({
    level: isProduction ? "info" : "debug",
    format: isProduction ? jsonFormat : devFormat,
  }),
];

if (isProduction) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: jsonFormat,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      format: jsonFormat,
    })
  );
}

/**
 * =========================
 * Logger instance
 * =========================
 */
const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: jsonFormat, // Format default untuk transport yang tidak menentukannya
  defaultMeta: {
    service: "chat-api",
  },
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "rejections.log"),
    }),
  ],
});

export default logger;
