/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * ADD THESE ROUTES to your routes/auth.js file
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

// ... Your existing routes (register, login, GET /auth) ...

// @route   PUT /api/auth/profile
// @desc    Update user profile (username and bio)
// @access  Private
router.put("/profile", authMiddleware, async (req, res) => {
  const { username, bio } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: "Username already taken" });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio; // Allow empty string

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

// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
router.put("/password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ msg: "Please provide current and new password" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ msg: "New password must be at least 6 characters" });
  }

  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account and all associated data
// @access  Private
router.delete("/account", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user's posts
    await Post.deleteMany({ user: userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
