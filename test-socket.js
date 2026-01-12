const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwidXNlcklkIjoiMyIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NjgyMTc4OTUsImV4cCI6MTc2ODMwNDI5NX0.ISSxZGgcU4HMYZH2AF21i_fn537ExI83DcuFmOnxDnQ",
  },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("presence:update", (data) => {
  console.log("📡 Presence update:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});

// set presence
setTimeout(() => {
  console.log("🟢 Set presence ONLINE");
  socket.emit("presence:set", "ONLINE");
}, 2000);

// logout
setTimeout(() => {
  console.log("🚪 Logout");
  socket.disconnect();
}, 6000);
