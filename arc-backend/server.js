/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

// Initialize Express App
const app = express();

// Middleware
// Enable Cross-Origin Resource Sharing (CORS)
// It lets the frontend (localhost:3000) talk to your backend (localhost:5000) without the browser blocking it.
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Database Connection
const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });

// Define API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));
app.use("/api/posts", require("./routes/posts"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
