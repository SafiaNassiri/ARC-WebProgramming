const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Our "bouncer" to check for a valid token
const User = require('../models/User'); // Our User model

// --- @route   GET /api/games/favorites ---
// --- @desc    Get all of a user's favorite games ---
// --- @access  Private ---
router.get('/favorites', authMiddleware, async (req, res) => {
    try {
        // req.user.id is added by the authMiddleware
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Send back just the list of favorite games
        res.json(user.favoriteGames);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- @route   PUT /api/games/favorite ---
// --- @desc    Add a game to favorites ---
// --- @access  Private ---
router.put('/favorite', authMiddleware, async (req, res) => {
    // Get game details from the request body
    const { gameId, name, imageUrl, rating } = req.body;

    // Basic validation
    if (!gameId || !name) {
        return res.status(400).json({ msg: 'Game ID and Name are required' });
    }

    const newFavorite = {
        gameId,
        name,
        imageUrl: imageUrl || '',
        rating: rating || 0,
    };

    try {
        const user = await User.findById(req.user.id);

        // Check if the game is already in favorites
        const isAlreadyFavorited = user.favoriteGames.some(
            (game) => game.gameId === gameId
        );

        if (isAlreadyFavorited) {
            return res.status(400).json({ msg: 'Game already in favorites' });
        }

        // Add to the beginning of the array
        user.favoriteGames.unshift(newFavorite);

        await user.save();

        // Send back the updated list of favorites
        res.json(user.favoriteGames);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- @route   DELETE /api/games/favorite/:gameId ---
// --- @desc    Remove a game from favorites ---
// --- @access  Private ---
router.delete('/favorite/:gameId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const gameIdToRemove = req.params.gameId;

        // Filter out the game we want to remove
        user.favoriteGames = user.favoriteGames.filter(
            (game) => game.gameId !== gameIdToRemove
        );

        await user.save();

        // Send back the updated list
        res.json(user.favoriteGames);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

