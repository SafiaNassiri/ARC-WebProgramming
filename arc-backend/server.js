/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Log ALL incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Server health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Verify auth routes are mounted
app.get("/api/auth/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Auth routes are mounted correctly",
  });
});

console.log("Loading auth routes...");
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
console.log("Auth routes mounted at /api/auth");

console.log("Loading games routes...");
const gamesRoutes = require("./routes/games");
app.use("/api/games", gamesRoutes);
console.log("Games routes mounted at /api/games");

console.log("Loading posts routes...");
const postsRoutes = require("./routes/posts");
app.use("/api/posts", postsRoutes);
console.log("Posts routes mounted at /api/posts");

app.use((req, res) => {
  console.log(`⚠️ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      "GET /health",
      "GET /api/auth/test",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "PUT /api/auth/profile",
      "PUT /api/auth/password",
      "DELETE /api/auth/account",
      "GET /api/games",
      "GET /api/posts",
    ],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Auth test: http://localhost:${PORT}/api/auth/test\n`);
});
