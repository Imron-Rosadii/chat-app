import { Server, Socket } from "socket.io";
import prisma from "../utils/prisma";

export function handlePresence(io: Server, socket: Socket) {
  const userId = BigInt(socket.data.userId);

  // 🟢 USER ONLINE
  (async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { presence: "ONLINE" },
    });

    io.emit("presence:update", {
      userId: userId.toString(),
      presence: "ONLINE",
    });
  })();

  // 🔴 LOGOUT DARI FRONTEND
  socket.on("logout", async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { presence: "OFFLINE" },
    });

    io.emit("presence:update", {
      userId: userId.toString(),
      presence: "OFFLINE",
    });

    socket.disconnect(true);
  });

  // ❌ DISCONNECT (TAB TUTUP / INTERNET PUTUS)
  socket.on("disconnect", async () => {
    await prisma.user.update({
      where: { id: userId },
      data: { presence: "OFFLINE" },
    });

    io.emit("presence:update", {
      userId: userId.toString(),
      presence: "OFFLINE",
    });
  });
}
