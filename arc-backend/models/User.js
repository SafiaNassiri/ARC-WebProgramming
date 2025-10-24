const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Schema for a User
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: 'No bio provided.',
    },
    // --- THIS IS THE UPGRADED SECTION ---
    // We are now storing an array of game objects
    favoriteGames: [
        {
            gameId: { type: String, required: true }, // The ID from the RAWG API
            name: { type: String, required: true },
            imageUrl: { type: String },
            rating: { type: Number },
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = User = mongoose.model('user', UserSchema);

