/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user.favoriteGames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/favorite", authMiddleware, async (req, res) => {
  const { gameId, name, imageUrl, rating } = req.body;

  if (!gameId || !name) {
    return res.status(400).json({ msg: "Game ID and Name are required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Prevent duplicates by checking if gameId already exists
    const existingIndex = user.favoriteGames.findIndex(
      (game) => game.gameId === gameId
    );

    if (existingIndex !== -1) {
      // Optional: update info if needed, otherwise just return current list
      return res.status(400).json({ msg: "Game already in favorites" });
    }

    const newFavorite = {
      gameId,
      name,
      imageUrl: imageUrl || "",
      rating: rating || 0,
    };

    // Add to favorites
    user.favoriteGames.unshift(newFavorite);
    await user.save();

    res.json(user.favoriteGames);
  } catch (err) {
    console.error("Error inside /favorite route:", err);
    res.status(500).send("Server Error");
  }
});

router.delete("/favorite/:gameId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const gameIdToRemove = req.params.gameId;

    // Remove the game with the matching gameId
    user.favoriteGames = user.favoriteGames.filter(
      (game) => game.gameId !== gameIdToRemove
    );

    await user.save();
    res.json(user.favoriteGames);
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
