/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ======================
   Global Middleware
====================== */
app.use(cors());
app.use(express.json());

// Serve uploaded files (avatars, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Log ALL incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* ======================
   Database Connection
====================== */
const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* ======================
   Test / Health Routes
====================== */
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.get("/api/auth/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Auth routes are mounted correctly",
  });
});

/* ======================
   API Routes
====================== */
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const gamesRoutes = require("./routes/games");
app.use("/api/games", gamesRoutes);

const postsRoutes = require("./routes/posts");
app.use("/api/posts", postsRoutes);

/* ======================
   404 Handler
====================== */
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
      "POST /api/auth/avatar", // Avatar upload
      "DELETE /api/auth/account",
      "GET /api/games",
      "GET /api/posts",
    ],
  });
});

/* ======================
   Start Server
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Auth test: http://localhost:${PORT}/api/auth/test`);
  console.log(
    `Avatar uploads served at: http://localhost:${PORT}/uploads/avatars`
  );
});
