const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import our User model
const authMiddleware = require('../middleware/auth'); // Import the middleware

// DEFINE router first!
const router = express.Router();

// --- @route   GET /api/auth ---
// --- @desc    Get the logged-in user's data (using the token) ---
// This route MUST come before register/login if using the same path segment
router.get('/', authMiddleware, async (req, res) => {
    try {
        // req.user.id was added by the authMiddleware
        // Find user by ID, but DON'T send back the password
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- @route   POST /api/auth/register ---
// --- @desc    Register a new user ---
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }


    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'This username is already taken' });
        }

        // 2. Create new user instance
        user = new User({
            username,
            email,
            password,
        });

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save user to database
        await user.save();

        // 5. Create and return a JSON Web Token (JWT)
        const payload = {
            user: {
                id: user.id, // This is the user's ID from MongoDB
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send token back to the client
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- @route   POST /api/auth/login ---
// --- @desc    Authenticate user & get token (Login) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 2. Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 3. Create and return a JSON Web Token (JWT)
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send token back to the client
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;