/** 
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
*/

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Initialize router
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        // req.user.id comes from authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' });
    if (password.length < 6)
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });

    try {
        // Check if email already exists
        if (await User.findOne({ email }))
            return res.status(400).json({ msg: 'User with this email already exists' });

        // Check if username already exists
        if (await User.findOne({ username }))
            return res.status(400).json({ msg: 'This username is already taken' });

        // Create new user instance
        const user = new User({ username, email, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to DB
        await user.save();

        // Create JWT payload
        const payload = { user: { id: user.id } };

        // Sign and return JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' });

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Create JWT payload
        const payload = { user: { id: user.id } };

        // Sign and return JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
