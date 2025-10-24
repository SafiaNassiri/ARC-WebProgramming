const jwt = require('jsonwebtoken');

// This middleware function acts as a "bouncer"
module.exports = function (req, res, next) {
    // 1. Get token from the request header (named 'x-auth-token')
    const token = req.header('x-auth-token');

    // 2. Check if no token is present
    if (!token) {
        // 401 means 'Unauthorized'
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify the token using your JWT_SECRET
    try {
        // jwt.verify checks the signature and expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If valid, add the user's ID (from the token payload) to the request object
        // Now any protected route can know *who* made the request
        req.user = decoded.user;
        next(); // Pass control to the next middleware or the actual route handler
    } catch (err) {
        // If token is not valid (bad signature, expired, etc.)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};