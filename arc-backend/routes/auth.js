const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/avatars"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Log that routes are being registered
console.log("Setting up auth routes...");

// GET /api/auth - Get current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/auth/register - Register new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ msg: "Please enter all fields" });
  if (password.length < 6)
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });

  try {
    if (await User.findOne({ email }))
      return res
        .status(400)
        .json({ msg: "User with this email already exists" });
    if (await User.findOne({ username }))
      return res.status(400).json({ msg: "This username is already taken" });

    const user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/auth/login - Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Please enter all fields" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/auth/avatar - Upload user avatar
router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      // Save relative path to DB
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      res.json({ msg: "Avatar uploaded successfully", avatar: user.avatar });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error uploading avatar" });
    }
  }
);

// PUT /api/auth/profile - Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  console.log("PUT /api/auth/profile hit");
  const { username, bio } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ msg: "Username already taken" });
    }

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/auth/password - Change password
router.put("/password", authMiddleware, async (req, res) => {
  console.log("PUT /api/auth/password hit");
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res
      .status(400)
      .json({ msg: "Please provide current and new password" });
  if (newPassword.length < 6)
    return res
      .status(400)
      .json({ msg: "New password must be at least 6 characters" });

  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /api/auth/account - Delete account
router.delete("/account", authMiddleware, async (req, res) => {
  console.log("DELETE /api/auth/account hit");
  try {
    const userId = req.user.id;
    const Post = require("../models/Post");
    await Post.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

console.log("Auth routes registered:", [
  "GET /",
  "POST /register",
  "POST /login",
  "PUT /profile",
  "PUT /password",
  "DELETE /account",
]);

module.exports = router;
