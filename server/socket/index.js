// socket/index.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // Optional: join a room if needed
    socket.on("join", (userId) => {
      socket.join(userId); // for personal updates
      console.log(`📥 User ${userId} joined their personal room`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  // Helper function to emit task updates
  global.broadcastTaskUpdate = () => {
    io.emit("taskUpdated");
  };
};