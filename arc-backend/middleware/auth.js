const jwt = require("jsonwebtoken");

/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Middleware to protect routes
 * Checks for a JWT token in the 'x-auth-token' header
 */
module.exports = function (req, res, next) {
  // Retrieve token from header
  const token = req.header("x-auth-token");

  // If no token is provided, block access
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify the token
  try {
    // jwt.verify throws an error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info from payload to the request object
    req.user = decoded.user;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
