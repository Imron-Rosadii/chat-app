import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { handlePresence } from "./presence";

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "*", // nanti sesuaikan frontend
    },
  });

  // Auth middleware (JWT)
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;

      socket.data.userId = payload.sub || payload.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    handlePresence(io, socket);
  });
}
