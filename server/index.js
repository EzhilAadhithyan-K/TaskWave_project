const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");

dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const pushRoutes = require("./routes/push");
const setupSocket = require("./socket/index");
require("./utils/reminderJob");

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// === Middleware ===
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// === Rate Limiting ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// === API Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/tasks", (req, res, next) => {
  req.io = io; // inject Socket.IO instance
  next();
}, taskRoutes);

// === Test Routes ===
app.get("/api/tasks/test", (req, res) => {
  res.status(200).json({ message: "Tasks route is working" });
});

app.get("/", (req, res) => res.send("API Running"));

// === Start Server ===
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// === Setup WebSockets ===
setupSocket(io);