const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads variables from .env file

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
// Enable All CORS Requests
app.use(cors());
// Body Parser: Allow app to accept JSON
app.use(express.json());

// --- Database Connection ---
const db = process.env.MONGO_URI;

mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); // Exit process with failure
    });

// --- Define Routes ---
// Any URL starting with /api/auth will be handled by routes/auth.js
app.use('/api/auth', require('./routes/auth'));
// Any URL starting with /api/games will be handled by routes/games.js
app.use('/api/games', require('./routes/games'));

// --- Start Server ---
// Listen for connections
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

