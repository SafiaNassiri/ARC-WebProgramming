const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate usernames
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: 'No bio provided.', // Default bio text
    },
    // Array of favorite games
    favoriteGames: [
        {
            gameId: { type: String, required: true }, // RAWG API game ID
            name: { type: String, required: true }, // Game name
            imageUrl: { type: String }, // Optional image URL
            rating: { type: Number }, // Optional rating
        }
    ],
    date: {
        type: Date,
        default: Date.now, // Timestamp when user is created
    },
});

module.exports = User = mongoose.model('user', UserSchema);
